import { ApiError, NotFoundError } from "./errors";
import {
  archiveNotionSourcePage,
  unarchiveNotionSourcePage,
} from "./notion-sync";
import { dispatchOrnamentSyncWorkflow } from "./notion-webhook";
import { archiveSource, getSource, unarchiveSource } from "./repository";
import { getExportedSource } from "./sources-export";

export type ArchiveSourceResult = {
  id: string;
  archived: boolean;
  dispatched: boolean;
};

async function syncLocalArchiveState(id: string, archived: boolean) {
  try {
    await getSource(id);
  } catch {
    return;
  }

  if (archived) {
    await archiveSource(id);
    return;
  }

  await unarchiveSource(id);
}

async function maybeDispatchSync(clientPayload: Record<string, unknown>) {
  const token = process.env.GITHUB_DISPATCH_TOKEN?.trim();
  if (!token) {
    return false;
  }

  const repository =
    process.env.GITHUB_REPOSITORY?.trim() || "jmfrnsn/portfolio-jun-2026";

  try {
    await dispatchOrnamentSyncWorkflow({
      token,
      repository,
      clientPayload,
    });
    return true;
  } catch (error) {
    console.error("[ornaments] Failed to dispatch ornament sync", error);
    return false;
  }
}

function requireNotionLinkedSource(id: string) {
  const source = getExportedSource(id);
  if (!source) {
    throw new NotFoundError("Source");
  }

  if (!source.notionPageId) {
    throw new ApiError(
      "Source is not linked to a Notion page",
      400,
      "MISSING_NOTION_PAGE",
    );
  }

  return source;
}

export async function archiveCatalogSource(
  id: string,
): Promise<ArchiveSourceResult> {
  const source = requireNotionLinkedSource(id);

  if (source.notionStatus === "Archived") {
    throw new ApiError("Source is already archived", 409, "ALREADY_ARCHIVED");
  }

  await archiveNotionSourcePage(source.notionPageId!);
  await syncLocalArchiveState(id, true);

  const dispatched = await maybeDispatchSync({
    source: "website-archive",
    sourceId: id,
    notionPageId: source.notionPageId,
  });

  return { id, archived: true, dispatched };
}

export async function unarchiveCatalogSource(
  id: string,
): Promise<ArchiveSourceResult> {
  const source = requireNotionLinkedSource(id);

  if (source.notionStatus !== "Archived") {
    throw new ApiError("Source is not archived", 409, "NOT_ARCHIVED");
  }

  await unarchiveNotionSourcePage(source.notionPageId!);
  await syncLocalArchiveState(id, false);

  const dispatched = await maybeDispatchSync({
    source: "website-unarchive",
    sourceId: id,
    notionPageId: source.notionPageId,
  });

  return { id, archived: false, dispatched };
}
