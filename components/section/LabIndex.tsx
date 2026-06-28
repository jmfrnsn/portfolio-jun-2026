"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { SiteSection } from "@/lib/site-sections";
import { sectionItemHref } from "@/lib/site-sections";

type LabIndexProps = {
  section: SiteSection;
};

type UploadedAsset = {
  id: string;
  name: string;
  type: string;
  url: string;
  kind: "image" | "video";
};

type LabVisual =
  | {
      kind: "image";
      src: string;
      width: number;
      height: number;
      className?: string;
      imageClassName?: string;
    }
  | {
      kind: "placeholder";
      className?: string;
      label: string;
    };

const LAB_VISUALS: LabVisual[] = [
  {
    kind: "image",
    src: "/lab/figma/lab-coworking.png",
    width: 2990,
    height: 1464,
    className: "w-[min(48rem,72vw)]",
  },
  {
    kind: "placeholder",
    label: "Brand Archive",
    className: "aspect-[16/9] w-[min(44rem,68vw)]",
  },
  {
    kind: "placeholder",
    label: "Photo Gallery",
    className: "aspect-[2.05/1] w-[min(36rem,62vw)]",
  },
  {
    kind: "placeholder",
    label: "System 1 OS Chess",
    className: "aspect-[1.42/1] w-[min(31rem,58vw)]",
  },
  {
    kind: "placeholder",
    label: "Plant Care",
    className: "aspect-[9/16] w-[min(14rem,38vw)] rounded-b-[2rem]",
  },
  {
    kind: "image",
    src: "/lab/figma/lab-waterlilies.jpg",
    width: 2260,
    height: 2260,
    className: "w-[min(23rem,56vw)]",
    imageClassName: "rounded-sm",
  },
];

function getMediumLabel(type: string): string {
  if (type.startsWith("video/")) return "Video";
  if (type.startsWith("image/")) return "Image";
  return "Asset";
}

function formatFileSize(size: number): string {
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadedAssetPreview({ asset }: { asset: UploadedAsset }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden border border-ink/12 bg-highlight">
      {asset.kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset.url}
          alt={asset.name}
          className="h-full w-full object-cover"
        />
      ) : (
        <video
          src={asset.url}
          className="h-full w-full object-cover"
          controls
          muted
          playsInline
        />
      )}
    </div>
  );
}

function DottedRule() {
  return (
    <span
      className="h-px min-w-8 flex-1 bg-repeat-x opacity-55"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgb(39 48 28 / 0.32) 0.7px, transparent 0.7px)",
        backgroundSize: "8px 1px",
      }}
      aria-hidden="true"
    />
  );
}

function LabVisualFrame({ visual, title }: { visual: LabVisual; title: string }) {
  if (visual.kind === "image") {
    return (
      <div className={`relative mx-auto ${visual.className ?? ""}`.trim()}>
        <Image
          src={visual.src}
          alt=""
          width={visual.width}
          height={visual.height}
          sizes="(max-width: 768px) 72vw, 48rem"
          className={`h-auto w-full object-contain ${visual.imageClassName ?? ""}`.trim()}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative mx-auto overflow-hidden border border-ink/10 bg-highlight/75 ${visual.className ?? ""}`.trim()}
      aria-label={title}
    >
      <div className="absolute inset-3 border border-ink/10" aria-hidden="true" />
      <div className="absolute left-1/2 top-1/2 w-[72%] -translate-x-1/2 -translate-y-1/2">
        <div className="h-2 w-full bg-ink/8" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="aspect-square bg-paper" />
          <div className="aspect-square bg-ink/10" />
          <div className="aspect-square bg-paper" />
        </div>
        <p className="mt-4 text-center font-mono text-[10px] font-extralight uppercase tracking-[0.12em] text-ink/35">
          {visual.label}
        </p>
      </div>
    </div>
  );
}

function LabProject({
  href,
  index,
  title,
  medium,
  visual,
}: {
  href: string;
  index: number;
  title: string;
  medium: string;
  visual: LabVisual;
}) {
  return (
    <article className="relative flex items-center justify-center py-10 md:py-14">
      <Link
        href={href}
        className="absolute inset-x-0 top-1/2 z-0 grid -translate-y-1/2 grid-cols-[auto_auto_minmax(2rem,1fr)_auto] items-center gap-2 px-2 py-1 font-mono text-[0.6875rem] font-extralight uppercase tracking-[-0.04375rem] text-ink transition-colors hover:bg-highlight/70 md:text-sm"
      >
        <span className="font-sans text-ink/70">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span>{title}</span>
        <DottedRule />
        <span className="text-right">{medium}</span>
      </Link>
      <Link
        href={href}
        className="relative z-10 block bg-paper transition-opacity hover:opacity-80"
      >
        <LabVisualFrame visual={visual} title={title} />
      </Link>
    </article>
  );
}

function LabMediaUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const assetsRef = useRef<UploadedAsset[]>([]);
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<UploadedAsset[]>([]);

  useEffect(() => {
    assetsRef.current = assets;
  }, [assets]);

  useEffect(() => {
    return () => {
      assetsRef.current.forEach((asset) => URL.revokeObjectURL(asset.url));
    };
  }, []);

  const acceptedTypes = useMemo(() => ["image/", "video/"], []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const addFiles = (files: FileList | File[]) => {
    const nextAssets: UploadedAsset[] = Array.from(files)
      .filter((file) => acceptedTypes.some((type) => file.type.startsWith(type)))
      .map((file) => ({
        id: `${file.name}-${file.lastModified}-${file.size}`,
        name: file.name.replace(/\.[^.]+$/, ""),
        type: `${getMediumLabel(file.type)} · ${formatFileSize(file.size)}`,
        url: URL.createObjectURL(file),
        kind: file.type.startsWith("video/") ? "video" : "image",
      }));

    setAssets((current) => [...nextAssets, ...current]);
  };

  const clearAssets = () => {
    assets.forEach((asset) => URL.revokeObjectURL(asset.url));
    setAssets([]);
  };

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed bottom-4 left-4 z-50 sm:bottom-6 sm:left-6"
    >
      <div className="pointer-events-auto flex flex-col items-start gap-1.5">
        {open ? (
          <div className="w-[min(calc(100vw-2rem),22rem)] overflow-hidden rounded-md border border-ink/10 bg-paper/95 shadow-sm backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-3 py-2.5">
              <div>
                <p className="font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/60">
                  Disposable Uploads
                </p>
                <p className="mt-1 font-serif text-sm leading-snug tracking-[-0.04375rem] text-ink/70">
                  Local image/video previews. Nothing is saved.
                </p>
              </div>
              {assets.length > 0 ? (
                <button
                  type="button"
                  onClick={clearAssets}
                  className="cursor-pointer font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/40 transition-colors hover:text-ink"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div className="p-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  addFiles(event.dataTransfer.files);
                }}
                className="flex min-h-28 w-full cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-ink/20 bg-highlight/45 px-4 py-6 text-center transition-colors hover:border-ink/30 hover:bg-highlight/70"
              >
                <span className="font-serif text-base tracking-[-0.04375rem] text-ink">
                  Drop files here
                </span>
                <span className="mt-1 font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/45">
                  Images or videos
                </span>
              </button>

              <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="sr-only"
                onChange={(event) => {
                  if (!event.target.files) return;
                  addFiles(event.target.files);
                  event.target.value = "";
                }}
              />

              {assets.length > 0 ? (
                <div className="mt-2 max-h-[45vh] space-y-2 overflow-y-auto pr-1">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2 border-t border-ink/10 pt-2 first:border-t-0 first:pt-0"
                    >
                      <UploadedAssetPreview asset={asset} />
                      <div className="min-w-0 self-center">
                        <p className="truncate font-serif text-sm tracking-[-0.04375rem] text-ink">
                          {asset.name}
                        </p>
                        <p className="mt-0.5 truncate font-mono text-[10px] font-extralight uppercase tracking-[0.08em] text-ink/45">
                          {asset.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-haspopup="dialog"
          className="cursor-pointer rounded-md border border-ink/10 bg-paper/80 px-2.5 py-1.5 font-mono text-[10px] font-extralight uppercase tracking-[0.1em] text-ink/45 backdrop-blur-sm transition-colors hover:border-ink/20 hover:bg-paper hover:text-ink/70"
        >
          Uploads{assets.length > 0 ? ` · ${assets.length}` : ""}
        </button>
      </div>
    </div>
  );
}

export function LabIndex({ section }: LabIndexProps) {
  return (
    <div className="min-h-svh bg-paper text-ink">
      <div className="px-6 pb-28 pt-44 sm:px-10 md:pt-52 lg:px-14">
        <main className="mx-auto flex w-full max-w-[96rem] flex-col gap-28 md:gap-36">
          {section.items.map((item, index) => (
            <LabProject
              key={item.slug}
              href={sectionItemHref(section.slug, item.slug)}
              index={index}
              title={item.title}
              medium={item.medium ?? item.year ?? "Lab"}
              visual={LAB_VISUALS[index % LAB_VISUALS.length]!}
            />
          ))}
        </main>

        <footer className="mx-auto mt-36 flex w-full max-w-[96rem] flex-col items-center md:mt-44">
          <div className="relative h-auto w-[min(18rem,56vw)]">
            <Image
              src="/lab/figma/lab-footer.png"
              alt=""
              width={736}
              height={490}
              sizes="18rem"
              className="h-auto w-full object-contain"
            />
          </div>
          <p className="mt-8 max-w-[96rem] text-justify font-serif text-xs leading-relaxed tracking-[-0.04375rem] text-ink/45 md:text-sm">
            I am endlessly inspired by books, movies, objects, and other artifacts.
            This lab collects small experiments, tools, studies, and sketches that
            help me notice and observe the world anew.
          </p>
        </footer>
      </div>
      <LabMediaUploader />
    </div>
  );
}
