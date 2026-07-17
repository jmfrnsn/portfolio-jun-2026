"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ArchiveSourceButtonProps = {
  sourceId: string;
  archived: boolean;
  onCompleted?: (nextArchived: boolean) => void;
};

type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
  };
};

async function postArchiveAction(sourceId: string, archived: boolean) {
  const endpoint = archived
    ? `/api/ornaments/sources/${sourceId}/unarchive`
    : `/api/ornaments/sources/${sourceId}/archive`;

  const response = await fetch(endpoint, {
    method: "POST",
    credentials: "same-origin",
  });

  const body = (await response.json().catch(() => ({}))) as ApiErrorBody & {
    ok?: boolean;
    dispatched?: boolean;
  };

  if (!response.ok) {
    const error = new Error(body.error?.message ?? "Request failed") as Error & {
      code?: string;
      status?: number;
    };
    error.code = body.error?.code;
    error.status = response.status;
    throw error;
  }

  return body;
}

export function ArchiveSourceButton({
  sourceId,
  archived,
  onCompleted,
}: ArchiveSourceButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<"active" | "archived">(
    archived ? "archived" : "active",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isArchived = status === "archived";
  const actionLabel = isArchived ? "Restore" : "Archive";

  async function runAction() {
    const confirmMessage = isArchived
      ? "Restore this source to the active catalog?"
      : "Archive this source in Notion and move it out of the active list?";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setError(null);
    setMessage(null);
    setIsPending(true);

    try {
      const result = await postArchiveAction(sourceId, isArchived);
      const nextArchived = !isArchived;
      setStatus(nextArchived ? "archived" : "active");
      setMessage(
        result.dispatched
          ? `${actionLabel}d. Sync queued — catalog refreshes shortly.`
          : `${actionLabel}d in Notion. Catalog refreshes on the next sync.`,
      );
      onCompleted?.(nextArchived);
      router.refresh();
    } catch (actionError) {
      const code =
        actionError && typeof actionError === "object" && "code" in actionError
          ? String((actionError as { code?: string }).code)
          : undefined;

      if (code === "UNAUTHORIZED") {
        setError("Sign in at /ornaments/admin");
        return;
      }

      if (code === "MISSING_ENV") {
        setError(
          actionError instanceof Error
            ? actionError.message
            : "Missing Notion env on host",
        );
        return;
      }

      setError(
        actionError instanceof Error
          ? actionError.message
          : `Unable to ${actionLabel.toLowerCase()}`,
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void runAction();
        }}
        disabled={isPending}
        className="bg-paper/95 px-2.5 py-1.5 font-mono text-xs font-extralight uppercase tracking-[0.08em] text-ink transition-opacity disabled:cursor-wait disabled:opacity-50"
      >
        {isPending ? `${actionLabel}…` : actionLabel}
      </button>
      {message ? (
        <p className="max-w-[12rem] bg-paper/95 px-2 py-1 text-right font-serif text-xs leading-snug text-ink/65">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="max-w-[12rem] bg-paper/95 px-2 py-1 text-right font-serif text-xs leading-snug text-ink/80">
          {error}
        </p>
      ) : null}
    </div>
  );
}
