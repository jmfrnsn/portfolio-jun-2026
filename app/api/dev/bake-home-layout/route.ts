import { writeFile } from "node:fs/promises";
import path from "node:path";

import {
  buildContentsDataSource,
  buildHomeCopyDialsSource,
  buildHomeLayoutDialsSource,
  type BakeHomeLayoutPayload,
} from "@/lib/bake-home-layout";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = (await request.json()) as BakeHomeLayoutPayload;

  await Promise.all([
    writeFile(
      path.join(process.cwd(), "lib/home-layout-dials.ts"),
      buildHomeLayoutDialsSource(payload),
      "utf8",
    ),
    writeFile(
      path.join(process.cwd(), "lib/home-copy-dials.ts"),
      buildHomeCopyDialsSource(payload.copy),
      "utf8",
    ),
    writeFile(
      path.join(process.cwd(), "components/home/contents-data.ts"),
      buildContentsDataSource(payload.copy),
      "utf8",
    ),
  ]);

  return Response.json({ ok: true });
}
