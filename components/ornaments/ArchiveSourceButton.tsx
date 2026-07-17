"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const ADMIN_SECRET_KEY = "ornament-admin-secret";

type ArchiveSourceButtonProps = {
  sourceId: string;
  archived: boolean;
};

type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
  };
};

function readStoredSecret() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(ADMIN_SECRET_KEY) ?? "";
}

function storeSecret(secret: string) {
  window.sessionStorage.setItem(ADMIN_SECRET_KEY, secret);
}

async function postArchiveAction(
  sourceId: string,
  archived: boolean,
  secret: string,
) {
  const endpoint = archived
    ? `/api/ornaments/sources/${sourceId}/unarchive`
    : `/api/ornaments/sources/${sourceId}/archive`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
    },
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

    let secret = readStoredSecret();
    if (!secret) {
      secret = window.prompt("Enter the ornament admin secret")?.trim() ?? "";
      if (!secret) {
        setError("Admin secret is required to archive sources.");
        return;
      }
      storeSecret(secret);
    }

    setError(null);
    setMessage(null);
    setIsPending(true);

    try {
      const result = await postArchiveAction(sourceId, isArchived, secret);
      setStatus(isArchived ? "active" : "archived");
      setMessage(
        result.dispatched
          ? `${actionLabel}d in Notion. Catalog sync has been queued.`
          : `${actionLabel}d in Notion. Catalog will refresh on the next sync.`,
      );
      router.refresh();
    } catch (actionError) {
      const code =
        actionError && typeof actionError === "object" && "code" in actionError
          ? String((actionError as { code?: string }).code)
          : undefined;

      if (code === "UNAUTHORIZED") {
        window.sessionStorage.removeItem(ADMIN_SECRET_KEY);
        setError("Admin secret was rejected. Try again.");
        return;
      }

      setError(
        actionError instanceof Error
          ? actionError.message
          : `Unable to ${actionLabel.toLowerCase()} source.`,
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 border-t border-ink/10 pt-6">
      <p className="font-mono text-xs font-extralight uppercase tracking-[0.08em] text-ink/40">
        Catalog status · {isArchived ? "Archived" : "Active"}
      </p>
      <button
        type="button"
        onClick={() => {
          void runAction();
        }}
        disabled={isPending}
        className="w-fit font-mono text-sm font-extralight uppercase tracking-[0.08em] text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink disabled:cursor-wait disabled:opacity-50"
      >
        {isPending ? `${actionLabel}…` : actionLabel}
      </button>
      {message ? (
        <p className="font-serif text-sm leading-relaxed text-ink/65">{message}</p>
      ) : null}
      {error ? (
        <p className="font-serif text-sm leading-relaxed text-ink/80">{error}</p>
      ) : null}
    </div>
  );
}
