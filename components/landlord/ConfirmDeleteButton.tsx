"use client";

import { useEffect, useId, useState } from "react";
import { Trash2 } from "lucide-react";

export function ConfirmDeleteButton({ entityLabel, pending, onDelete }: {
  entityLabel: string;
  pending: boolean;
  onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return <>
    <button
      type="button"
      disabled={pending}
      aria-label={`Delete ${entityLabel}`}
      onClick={() => setIsOpen(true)}
      className="inline-flex items-center gap-1.5 rounded-md border border-danger-border px-2.5 py-1.5 text-[10px] font-semibold text-danger-dark transition hover:bg-danger-light disabled:cursor-wait disabled:opacity-50"
    >
      <Trash2 className="h-3 w-3" /> Delete
    </button>

    {isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close confirmation dialog"
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 cursor-default bg-neutral-deep/50"
      />
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-sm rounded-xl border border-surface-border bg-surface p-5 shadow-xl"
      >
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-danger-light text-danger-dark">
          <Trash2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2 id={titleId} className="text-base font-semibold text-neutral-deep">
          Delete {entityLabel}?
        </h2>
        <p className="mt-1.5 text-sm text-neutral-medium">
          This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            autoFocus
            onClick={() => setIsOpen(false)}
            className="rounded-md border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-dark hover:bg-surface-hover"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
            className="rounded-md bg-danger-dark px-3 py-2 text-xs font-semibold text-surface-inverse hover:bg-danger-deep disabled:cursor-wait disabled:opacity-50"
          >
            {pending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </section>
    </div>}
  </>;
}
