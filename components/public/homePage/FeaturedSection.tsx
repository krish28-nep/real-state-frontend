"use client";

import Link from "next/link";
import PropertyCard from "@/components/public/PropertyCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/landlord/EntityStates";
import { getApiErrorMessage } from "@/lib/api/errors";
import { usePublicRentals } from "@/hooks/usePublicRentals";

export default function FeaturedSection() {
  const rentals = usePublicRentals();

  return (
    <section className="mx-4 my-10 lg:mx-40">
      <div className="flex items-center justify-between gap-4 p-2">
        <div>
          <h2 className="text-lg font-semibold">Featured Properties</h2>
          <p className="text-sm">Hand-picked premium listings available now.</p>
        </div>
        <Link href="/property" className="flex shrink-0 items-center gap-2 text-sm font-medium text-primary-medium hover:underline">View all</Link>
      </div>
      {rentals.isPending ? <LoadingState label="Loading featured rentals…" />
        : rentals.isError ? <ErrorState message={getApiErrorMessage(rentals.error, "Could not load featured rentals.")} onRetry={() => { void rentals.refetch(); }} />
          : rentals.records.length === 0 ? <EmptyState title="No available rentals yet." />
            : <div className="grid grid-cols-1 gap-4 p-2 sm:grid-cols-2 xl:grid-cols-4">
              {rentals.records.slice(0, 4).map((listing) => <PropertyCard key={listing.id} listing={listing} />)}
            </div>}
    </section>
  );
}
