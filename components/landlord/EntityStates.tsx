import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

const stateClass = "rounded-lg border border-surface-border bg-surface px-4 py-12 text-center text-xs text-neutral-medium";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return <div role="status" className={stateClass}><LoaderCircle className="mx-auto mb-2 h-4 w-4 animate-spin" />{label}</div>;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div role="alert" className={stateClass}><p className="text-danger-dark">{message}</p>{onRetry && <button type="button" onClick={onRetry} className="mt-2 rounded-md border border-neutral-200 px-3 py-1.5 font-semibold hover:bg-neutral-50">Try again</button>}</div>;
}

export function EmptyState({ title, action }: { title: string; action?: ReactNode }) {
  return <div className={stateClass}><p className="font-semibold text-neutral-dark">{title}</p>{action && <div className="mt-2">{action}</div>}</div>;
}
