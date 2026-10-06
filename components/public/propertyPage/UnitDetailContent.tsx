"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Bath, BedDouble, CircleHelp, DoorOpen, Images, LogIn, MapPin, Ruler, UserRoundPlus } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/components/landlord/EntityStates";
import { getApiErrorMessage } from "@/lib/api/errors";
import { getMediaUrl } from "@/lib/api/client";
import { PROPERTY_TYPE_LABELS } from "@/lib/api/properties";
import { usePublicUnitDetail } from "@/hooks/usePublicUnitDetail";

export default function UnitDetailContent({ propertyId, unitId }: { propertyId: number; unitId: number }) {
  const query = usePublicUnitDetail(unitId);
  if (!Number.isSafeInteger(propertyId) || propertyId < 1 || !Number.isSafeInteger(unitId) || unitId < 1) {
    return <main className="mx-auto max-w-3xl px-5 py-12"><ErrorState message="This rental could not be found." /></main>;
  }
  if (query.isPending) return <main className="mx-auto max-w-3xl px-5 py-12"><LoadingState label="Loading rental details…" /></main>;
  if (query.isError) return <main className="mx-auto max-w-3xl px-5 py-12"><ErrorState message={getApiErrorMessage(query.error, "Could not load this rental.")} onRetry={() => { void query.refetch(); }} /></main>;

  const { unit, images } = query.data;
  if (unit.propertyId !== propertyId) return <main className="mx-auto max-w-3xl px-5 py-12"><ErrorState message="This rental could not be found." /></main>;
  if (unit.status !== "AVAILABLE") return <main className="mx-auto max-w-3xl px-5 py-12"><EmptyState title="This unit is no longer available." action={<Link href="/property" className="font-semibold text-accent-deep hover:underline">Browse available rentals</Link>} /></main>;

  const property = unit.property;
  const location = [property.address, property.city, property.state, property.country].filter(Boolean).join(", ");
  const imageUrls = images.length > 0 ? images.map(({ imageUrl }) => imageUrl) : property.coverImage ? [property.coverImage] : [];
  const heroImage = getMediaUrl(imageUrls[0]) || "/banner.jpg";
  const overview = property.description?.trim() || "No description has been added for this property yet.";
  const unitFacts = [
    { label: "Floor", value: unit.floor === null ? "Not specified" : unit.floor === 0 ? "Ground floor" : String(unit.floor), icon: DoorOpen },
    { label: "Bedrooms", value: unit.bedrooms === null ? "Not specified" : String(unit.bedrooms), icon: BedDouble },
    { label: "Bathrooms", value: unit.bathrooms === null ? "Not specified" : String(unit.bathrooms), icon: Bath },
    { label: "Area", value: unit.areaSqft === null ? "Not specified" : `${unit.areaSqft.toLocaleString()} sqft`, icon: Ruler },
  ];

  return (
    <main className="min-h-screen bg-background pb-10">
      <section className="relative isolate flex min-h-[240px] items-end overflow-hidden sm:min-h-[290px]">
        <Image src={heroImage} alt={property.title} fill priority sizes="100vw" className="-z-20 object-cover object-center" unoptimized />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary-deepest/75 via-primary-deepest/35 to-primary-deepest/10" />
        <div className="mx-auto w-full max-w-7xl px-5 pb-7 sm:px-8 sm:pb-9">
          <Link href="/property" className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-surface-inverse/85 transition hover:text-surface-inverse"><ArrowLeft className="h-3.5 w-3.5" /> Browse rentals</Link>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-surface-inverse/75">{property.title}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-surface-inverse sm:text-3xl">Unit {unit.unitNumber}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-surface-inverse/85"><MapPin className="h-3.5 w-3.5" />{location}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-5 sm:px-8 sm:py-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(290px,0.8fr)] lg:gap-6">
        <div className="min-w-0 space-y-4">
          <section className="rounded-xl border border-surface-border-cool bg-surface p-4 shadow-sm sm:p-5">
            <h2 className="font-bold text-primary-medium">Unit overview</h2>
            <p className="mt-1.5 text-xs leading-5 text-neutral-muted sm:max-w-3xl">{overview}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {unitFacts.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-lg border border-surface-border-cool bg-surface-pink/70 p-3"><Icon className="h-3.5 w-3.5 text-neutral-muted" /><span className="mt-1.5 block text-[10px] uppercase tracking-wide text-neutral-muted">{label}</span><span className="mt-0.5 block text-xs font-semibold text-primary-medium">{value}</span></div>)}
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-surface-border-cool bg-surface shadow-sm">
            <h2 className="border-b border-surface-border-cool px-4 py-3 font-bold text-primary-medium sm:px-5">Rental details</h2>
            <dl className="divide-y divide-border">
              <div className="flex items-center justify-between gap-4 px-4 py-3 text-xs sm:px-5"><dt className="text-neutral-muted">Monthly rent</dt><dd className="font-bold text-primary-medium">Rs. {Number(unit.rent).toLocaleString()}</dd></div>
              <div className="flex items-center justify-between gap-4 px-4 py-3 text-xs sm:px-5"><dt className="text-neutral-muted">Availability</dt><dd className="font-semibold text-success-dark">Available</dd></div>
              <div className="flex items-center justify-between gap-4 px-4 py-3 text-xs sm:px-5"><dt className="text-neutral-muted">Property type</dt><dd className="font-semibold text-primary-medium">{PROPERTY_TYPE_LABELS[property.propertyType]}</dd></div>
            </dl>
          </section>

          <section id="unit-gallery" className="rounded-xl border border-surface-border-cool bg-surface p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex items-center justify-between"><h2 className="font-bold text-primary-medium">Unit gallery</h2><span className="text-xs text-neutral-muted">{imageUrls.length} {imageUrls.length === 1 ? "photo" : "photos"}</span></div>
            {imageUrls.length === 0 ? <p className="text-xs text-neutral-muted">No photos have been added for this unit.</p> : <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {imageUrls.map((imageUrl, index) => <div key={`${imageUrl}-${index}`} className="relative h-28 overflow-hidden rounded-lg sm:h-36"><Image src={getMediaUrl(imageUrl) || "/banner.jpg"} alt={`${property.title}, unit ${unit.unitNumber}, photo ${index + 1}`} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition duration-300 hover:scale-105" unoptimized /></div>)}
            </div>}
            {imageUrls.length > 0 && <a href="#unit-gallery" className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-md border border-surface-border-cool py-2 text-xs font-medium text-primary-medium transition hover:bg-surface-pink-hover"><Images className="h-3.5 w-3.5" /> View photos</a>}
          </section>
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <section className="rounded-xl border border-surface-border-cool bg-surface p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-bold text-primary-medium">Ready to apply?</h2><p className="mt-1 text-xs leading-5 text-neutral-muted">Create an account or log in to apply for Unit {unit.unitNumber}.</p></div><span className="rounded-lg bg-surface-pink p-2 text-secondary-light"><UserRoundPlus className="h-4 w-4" /></span></div>
            <div className="mt-4"><p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-muted">New tenant</p><Link href="/register" className="btn btn-primary w-full"><UserRoundPlus className="h-4 w-4" /> Create account to apply</Link></div>
            <div className="my-3 flex items-center gap-3 text-[10px] text-neutral-muted"><span className="h-px flex-1 bg-border" />OR<span className="h-px flex-1 bg-border" /></div>
            <div><p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-muted">Existing user</p><Link href="/login" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-surface-border-cool bg-surface px-4 py-2.5 text-sm font-semibold text-primary-medium transition hover:bg-surface-pink-hover"><LogIn className="h-4 w-4" /> Log in &amp; apply</Link></div>
            <p className="mt-4 flex gap-2 rounded-lg border border-surface-border-cool bg-surface-pink/70 p-3 text-[10px] leading-4 text-neutral-muted"><CircleHelp className="mt-0.5 h-3.5 w-3.5 shrink-0" />Submitting an application does not guarantee approval.</p>
          </section>
        </aside>
      </div>
    </main>
  );
}
