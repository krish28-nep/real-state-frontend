"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/components/landlord/EntityStates";
import PropertyCard from "@/components/public/PropertyCard";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getMediaUrl } from "@/lib/api/client";
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS } from "@/lib/api/properties";
import { usePublicPropertyDetail } from "@/hooks/usePublicPropertyDetail";

export default function PropertyDetailContent({ propertyId }: { propertyId: number }) {
  const [unitsPage, setUnitsPage] = useState(1);
  const { propertyQuery, unitsQuery, unitsPageSize } = usePublicPropertyDetail(propertyId, unitsPage);

  if (!Number.isSafeInteger(propertyId) || propertyId < 1) {
    return <main className="mx-auto max-w-3xl px-5 py-12"><ErrorState message="This property could not be found." /></main>;
  }
  if (propertyQuery.isPending || unitsQuery.isPending) {
    return <main className="mx-auto max-w-3xl px-5 py-12"><LoadingState label="Loading property details…" /></main>;
  }
  if (propertyQuery.isError || unitsQuery.isError) {
    const error = propertyQuery.error ?? unitsQuery.error;
    return <main className="mx-auto max-w-3xl px-5 py-12"><ErrorState message={getApiErrorMessage(error, "Could not load this property.")} onRetry={() => { void propertyQuery.refetch(); void unitsQuery.refetch(); }} /></main>;
  }

  const property = propertyQuery.data;
  if (!property) return <main className="mx-auto max-w-3xl px-5 py-12"><EmptyState title="This property could not be found." action={<Link href="/property" className="font-semibold text-accent-deep hover:underline">Browse available rentals</Link>} /></main>;

  const units = unitsQuery.data?.items ?? [];
  const availableCount = unitsQuery.data?.total ?? 0;
  const location = [property.address, property.city, property.state, property.country].filter(Boolean).join(", ");
  const coverImage = getMediaUrl(property.coverImage) || "/banner.jpg";
  const description = property.description?.trim() || "No description has been added for this property yet.";
  const pageCount = Math.max(1, Math.ceil(availableCount / unitsPageSize));

  return (
    <main className="min-h-screen bg-background pb-10">
      <section className="relative isolate flex min-h-[430px] items-end overflow-hidden sm:min-h-[500px] lg:min-h-[540px]">
        <Image src={coverImage} alt={property.title} fill priority sizes="100vw" className="-z-20 object-cover object-center" unoptimized />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary-deepest/85 via-primary-deepest/35 to-primary-deepest/5" />
        <div className="mx-auto w-full max-w-7xl px-5 pb-9 sm:px-8 sm:pb-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-surface/95 px-3 py-1.5 text-xs font-semibold text-primary-medium shadow-sm"><span className="h-2 w-2 rounded-full bg-success-medium" />{PROPERTY_STATUS_LABELS[property.status]}</div>
          <h1 className="text-3xl font-bold tracking-tight text-surface-inverse sm:text-4xl lg:text-5xl">{property.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-surface-inverse/85 sm:text-base"><MapPin className="h-4 w-4" />{location}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-7 px-5 py-7 sm:px-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)] lg:gap-8 lg:py-8">
        <div className="min-w-0 space-y-8">
          <section className="rounded-xl border border-surface-border-cool bg-surface p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-light">Property information</p><h2 className="mt-1 text-xl font-bold text-primary-medium sm:text-2xl">Overview</h2></div>
              <span className="rounded-full bg-surface-pink px-3 py-1 text-xs font-semibold text-primary-medium">{PROPERTY_TYPE_LABELS[property.propertyType]}</span>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-muted">{description}</p>
          </section>

          <section id="available-units" aria-labelledby="units-heading">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-light">Find your fit</p><h2 id="units-heading" className="mt-1 text-xl font-bold text-primary-medium sm:text-2xl">Available units</h2></div>
              <span className="text-sm text-neutral-muted">{availableCount} {availableCount === 1 ? "unit" : "units"} available</span>
            </div>
            {units.length === 0 ? <EmptyState title="There are no available units for this property right now." /> : <div className="grid gap-4 sm:grid-cols-2">{units.map((unit) => <div key={unit.id} className="flex flex-col overflow-hidden rounded-xl border border-surface-border-cool bg-surface shadow-sm"><div className="flex-1"><PropertyCard listing={unit} /></div><div className="border-t border-surface-border-cool px-4 py-3"><Link href={`/property/${property.id}/unit/${unit.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-medium hover:underline">View unit <ArrowUpRight className="h-3.5 w-3.5" /></Link></div></div>)}</div>}
            {pageCount > 1 && <nav aria-label="Available unit pages" className="mt-5 flex items-center justify-center gap-4"><button type="button" disabled={unitsPage <= 1} onClick={() => setUnitsPage((page) => page - 1)} className="rounded-md border border-surface-border-cool px-3 py-2 text-xs font-medium disabled:opacity-40">Previous</button><span className="text-xs text-neutral-muted">Page {unitsPage} of {pageCount}</span><button type="button" disabled={unitsPage >= pageCount} onClick={() => setUnitsPage((page) => page + 1)} className="rounded-md border border-surface-border-cool px-3 py-2 text-xs font-medium disabled:opacity-40">Next</button></nav>}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <section className="rounded-xl border border-surface-border-cool bg-surface p-4 shadow-sm sm:p-5">
            <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-muted">Property snapshot</h2>
            <div className="mt-3 grid grid-cols-2 gap-3"><div className="rounded-lg bg-surface-pink p-3"><span className="block text-xs text-neutral-muted">Available units</span><span className="mt-0.5 block text-2xl font-bold text-primary-medium">{availableCount}</span></div><div className="rounded-lg bg-surface-pink p-3"><span className="block text-xs text-neutral-muted">Property type</span><span className="mt-1 block text-base font-bold text-primary-medium">{PROPERTY_TYPE_LABELS[property.propertyType]}</span></div></div>
            <Link href="#available-units" className="btn btn-primary mt-4 w-full">Browse available units</Link>
          </section>
        </aside>
      </div>
    </main>
  );
}
