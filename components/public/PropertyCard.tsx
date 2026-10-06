import Image from "next/image";
import Link from "next/link";
import { Bath, Bed, MapPin, Ruler } from "lucide-react";
import { getMediaUrl } from "@/lib/api/client";
import type { PublicRentalListing } from "@/lib/api/units";

export default function PropertyCard({ listing }: { listing: PublicRentalListing }) {
  const image = listing.images[0]?.imageUrl ?? listing.property.coverImage;
  const location = [listing.property.address, listing.property.city, listing.property.state]
    .filter(Boolean)
    .join(", ");

  return (
    <Link href={`/property/${listing.propertyId}/`} className="block h-full rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
      <article className="h-full w-full overflow-hidden rounded-lg border border-surface-border-cool bg-surface shadow-xl transition-shadow hover:shadow-2xl">
        <div className="relative h-44 w-full">
          <Image
            fill
            src={getMediaUrl(image) || "/banner.jpg"}
            alt={`${listing.property.title}, unit ${listing.unitNumber}`}
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            unoptimized
          />
          <span className="absolute left-3 top-3 rounded-full bg-surface px-3 py-1 text-xs font-medium text-secondary-light shadow-sm">
            Available
          </span>
        </div>

        <div className="px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-primary-medium">{listing.property.title}</h2>
              <p className="mt-1 flex items-center gap-1 text-xs text-neutral-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{location}</span>
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-neutral-muted">Unit {listing.unitNumber}</p>
            </div>
            <p className="shrink-0 text-base font-bold text-primary-medium">Rs. {Number(listing.rent).toLocaleString()}</p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-surface-border-cool pt-3 text-xs text-neutral-muted">
            <div className="flex items-center gap-1.5 whitespace-nowrap"><Bed className="h-3.5 w-3.5" /><span>{listing.bedrooms ?? "—"} Bed</span></div>
            <div className="flex items-center justify-center gap-1.5 whitespace-nowrap"><Bath className="h-3.5 w-3.5" /><span>{listing.bathrooms ?? "—"} Bath</span></div>
            <div className="flex items-center justify-end gap-1.5 whitespace-nowrap"><Ruler className="h-3.5 w-3.5" /><span>{listing.areaSqft?.toLocaleString() ?? "—"} sqft</span></div>
          </div>
        </div>
      </article>
    </Link>
  );
}
