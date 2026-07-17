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
        setError("Admin secret required");
        return;
      }
      storeSecret(secret);
    }

    setError(null);
    setIsPending(true);

    try {
      await postArchiveAction(sourceId, isArchived, secret);
      setStatus(isArchived ? "active" : "archived");
      router.refresh();
    } catch (actionError) {
      const code =
        actionError && typeof actionError === "object" && "code" in actionError
          ? String((actionError as { code?: string }).code)
          : undefined;

      if (code === "UNAUTHORIZED") {
        window.sessionStorage.removeItem(ADMIN_SECRET_KEY);
        setError("Secret rejected");
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
      {error ? (
        <p className="max-w-[10rem] bg-paper/95 px-2 py-1 text-right font-serif text-xs leading-snug text-ink/80">
          {error}
        </p>
      ) : null}
    </div>
  );
}
