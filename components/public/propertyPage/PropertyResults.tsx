import PropertyCard from "@/components/public/PropertyCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/landlord/EntityStates";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { PublicRentalListing } from "@/lib/api/units";

type PropertyResultsProps = {
  records: PublicRentalListing[];
  total: number;
  page: number;
  pageSize: number;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
  onPageChange: (page: number) => void;
};

export default function PropertyResults({ records, total, page, pageSize, isPending, isError, error, onRetry, onPageChange }: PropertyResultsProps) {
  if (isPending) return <LoadingState label="Finding available rentals…" />;
  if (isError) return <ErrorState message={getApiErrorMessage(error, "Could not load available rentals.")} onRetry={onRetry} />;
  if (records.length === 0) return <EmptyState title="No available rentals match these filters." />;

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const firstResult = (page - 1) * pageSize + 1;
  const lastResult = Math.min(page * pageSize, total);

  return <>
    <div className="mb-2 flex items-center justify-between text-xs text-neutral-muted">
      <span>{total.toLocaleString()} available rentals</span>
      <span>Showing {firstResult}–{lastResult}</span>
    </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {records.map((listing) => <PropertyCard key={listing.id} listing={listing} />)}
    </div>
    {pageCount > 1 && <nav aria-label="Rental results pages" className="mt-5 flex items-center justify-center gap-4">
      <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="rounded-md border border-surface-border-cool px-3 py-2 text-xs font-medium disabled:opacity-40">Previous</button>
      <span className="text-xs text-neutral-muted">Page {page} of {pageCount}</span>
      <button type="button" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} className="rounded-md border border-surface-border-cool px-3 py-2 text-xs font-medium disabled:opacity-40">Next</button>
    </nav>}
  </>;
}
