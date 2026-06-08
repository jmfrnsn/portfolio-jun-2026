export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Interval = {
  left: number;
  right: number;
};

export type Point = {
  x: number;
  y: number;
};

export type WrapHullOptions = {
  smoothRadius: number;
  mode: "mean" | "envelope";
};

const wrapHullByKey = new Map<string, Promise<Point[]>>();

export function getWrapHull(
  src: string,
  options: WrapHullOptions,
): Promise<Point[]> {
  const key = `${src}::${options.mode}::${options.smoothRadius}`;
  const cached = wrapHullByKey.get(key);
  if (cached !== undefined) return cached;
  const promise = makeWrapHull(src, options);
  wrapHullByKey.set(key, promise);
  return promise;
}

export function transformWrapPoints(points: Point[], rect: Rect): Point[] {
  return points.map((point) => ({
    x: rect.x + point.x * rect.width,
    y: rect.y + point.y * rect.height,
  }));
}

export function getPolygonIntervalForBand(
  points: Point[],
  bandTop: number,
  bandBottom: number,
  horizontalPadding: number,
  verticalPadding: number,
): Interval | null {
  const sampleTop = bandTop - verticalPadding;
  const sampleBottom = bandBottom + verticalPadding;
  const startY = Math.floor(sampleTop);
  const endY = Math.ceil(sampleBottom);

  let left = Infinity;
  let right = -Infinity;

  for (let y = startY; y <= endY; y++) {
    const xs = getPolygonXsAtY(points, y + 0.5);
    for (let index = 0; index + 1 < xs.length; index += 2) {
      const runLeft = xs[index]!;
      const runRight = xs[index + 1]!;
      if (runLeft < left) left = runLeft;
      if (runRight > right) right = runRight;
    }
  }

  if (!Number.isFinite(left) || !Number.isFinite(right)) return null;
  return { left: left - horizontalPadding, right: right + horizontalPadding };
}

export function carveTextLineSlots(
  base: Interval,
  blocked: Interval[],
  minSlotWidth = 24,
): Interval[] {
  let slots: Interval[] = [base];

  for (const interval of blocked) {
    const next: Interval[] = [];
    for (const slot of slots) {
      if (interval.right <= slot.left || interval.left >= slot.right) {
        next.push(slot);
        continue;
      }
      if (interval.left > slot.left) {
        next.push({ left: slot.left, right: interval.left });
      }
      if (interval.right < slot.right) {
        next.push({ left: interval.right, right: slot.right });
      }
    }
    slots = next;
  }

  return slots.filter((slot) => slot.right - slot.left >= minSlotWidth);
}

async function makeWrapHull(
  src: string,
  options: WrapHullOptions,
): Promise<Point[]> {
  const image = new Image();
  image.src = src;
  await image.decode();

  const maxDimension = 320;
  const aspect = image.naturalWidth / image.naturalHeight;
  const width =
    aspect >= 1
      ? maxDimension
      : Math.max(64, Math.round(maxDimension * aspect));
  const height =
    aspect >= 1
      ? Math.max(64, Math.round(maxDimension / aspect))
      : maxDimension;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx === null) throw new Error("2d context unavailable");

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  const { data } = ctx.getImageData(0, 0, width, height);
  const lefts: Array<number | null> = new Array(height).fill(null);
  const rights: Array<number | null> = new Array(height).fill(null);
  const alphaThreshold = 12;

  for (let y = 0; y < height; y++) {
    let left = -1;
    let right = -1;
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3]!;
      if (alpha < alphaThreshold) continue;
      if (left === -1) left = x;
      right = x;
    }
    if (left !== -1 && right !== -1) {
      lefts[y] = left;
      rights[y] = right + 1;
    }
  }

  const validRows: number[] = [];
  for (let y = 0; y < height; y++) {
    if (lefts[y] !== null && rights[y] !== null) validRows.push(y);
  }
  if (validRows.length === 0) throw new Error(`No opaque pixels found in ${src}`);

  let boundLeft = Infinity;
  let boundRight = -Infinity;
  const boundTop = validRows[0]!;
  const boundBottom = validRows[validRows.length - 1]!;
  for (const y of validRows) {
    const left = lefts[y]!;
    const right = rights[y]!;
    if (left < boundLeft) boundLeft = left;
    if (right > boundRight) boundRight = right;
  }
  const boundWidth = Math.max(1, boundRight - boundLeft);
  const boundHeight = Math.max(1, boundBottom - boundTop);

  const smoothedLefts: number[] = new Array(height).fill(0);
  const smoothedRights: number[] = new Array(height).fill(0);

  for (const y of validRows) {
    let leftSum = 0;
    let rightSum = 0;
    let count = 0;
    let leftEdge = Infinity;
    let rightEdge = -Infinity;
    for (
      let offset = -options.smoothRadius;
      offset <= options.smoothRadius;
      offset++
    ) {
      const sampleIndex = y + offset;
      if (sampleIndex < 0 || sampleIndex >= height) continue;
      const left = lefts[sampleIndex];
      const right = rights[sampleIndex];
      if (left == null || right == null) continue;
      leftSum += left;
      rightSum += right;
      if (left < leftEdge) leftEdge = left;
      if (right > rightEdge) rightEdge = right;
      count++;
    }

    if (count === 0) {
      smoothedLefts[y] = 0;
      smoothedRights[y] = width;
      continue;
    }

    if (options.mode === "envelope") {
      smoothedLefts[y] = leftEdge;
      smoothedRights[y] = rightEdge;
    } else {
      smoothedLefts[y] = leftSum / count;
      smoothedRights[y] = rightSum / count;
    }
  }

  const step = Math.max(1, Math.floor(validRows.length / 52));
  const sampledRows: number[] = [];
  for (let index = 0; index < validRows.length; index += step) {
    sampledRows.push(validRows[index]!);
  }
  const lastRow = validRows[validRows.length - 1]!;
  if (sampledRows[sampledRows.length - 1] !== lastRow) sampledRows.push(lastRow);

  const points: Point[] = [];
  for (const y of sampledRows) {
    points.push({
      x: (smoothedLefts[y]! - boundLeft) / boundWidth,
      y: (y + 0.5 - boundTop) / boundHeight,
    });
  }
  for (let index = sampledRows.length - 1; index >= 0; index--) {
    const y = sampledRows[index]!;
    points.push({
      x: (smoothedRights[y]! - boundLeft) / boundWidth,
      y: (y + 0.5 - boundTop) / boundHeight,
    });
  }

  return points;
}

function getPolygonXsAtY(points: Point[], y: number): number[] {
  const xs: number[] = [];
  let a = points[points.length - 1];
  if (!a) return xs;

  for (const b of points) {
    if ((a.y <= y && y < b.y) || (b.y <= y && y < a.y)) {
      xs.push(a.x + ((y - a.y) * (b.x - a.x)) / (b.y - a.y));
    }
    a = b;
  }

  xs.sort((left, right) => left - right);
  return xs;
}
