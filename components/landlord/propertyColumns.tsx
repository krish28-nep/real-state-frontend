"use client";

import Image from "next/image";
import Link from "next/link";
import { ConfirmDeleteButton } from "@/components/landlord/ConfirmDeleteButton";
import type { EntityColumn } from "@/components/landlord/EntityTable";
import { getMediaUrl } from "@/lib/api/client";
import { PROPERTY_STATUS_LABELS, PROPERTY_TYPE_LABELS, type PropertyRecord, type PropertyStatus } from "@/lib/api/properties";
import { Pencil } from "lucide-react";

const statusStyle: Record<PropertyStatus, string> = {
  AVAILABLE: "bg-success-light text-success-dark",
  OCCUPIED: "bg-primary-status-light text-primary-status-dark",
  MAINTENANCE: "bg-accent-orange-light text-accent-orange-dark",
};

export function propertyColumns(
  removeProperty: (id: number) => void,
  isDeleting: boolean,
): EntityColumn<PropertyRecord>[] {
  return [
    {
      id: "property",
      header: "Property",
      cell: (property) => (
        <Link href={`/landlord/units?propertyId=${property.id}`} className="flex items-center gap-2.5">
          <span className="relative h-9 w-10 shrink-0 overflow-hidden rounded-md bg-neutral-100">
            <Image src={getMediaUrl(property.coverImage) || "/banner.jpg"} alt="" fill sizes="40px" className="object-cover" unoptimized />
          </span>
          <span className="whitespace-nowrap font-semibold text-neutral-deep hover:underline">{property.title}</span>
        </Link>
      ),
    },
    {
      id: "location",
      header: "Location",
      cell: (property) => <>
        <span className="block whitespace-nowrap font-medium">{property.address}</span>
        <span className="mt-0.5 block text-[9px] text-neutral-medium">{[property.city, property.state, property.country].filter(Boolean).join(", ")}</span>
      </>,
    },
    { id: "type", header: "Type", cell: (property) => <span className="text-[10px] uppercase text-neutral-dark">{PROPERTY_TYPE_LABELS[property.propertyType]}</span> },
    {
      id: "status",
      header: "Status",
      cell: (property) => <span className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase ${statusStyle[property.status]}`}>{PROPERTY_STATUS_LABELS[property.status]}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      cell: (property) => <div className="flex justify-end gap-1.5">
        <Link href={`/landlord/properties/${property.id}/edit`} aria-label={`Edit ${property.title}`} className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-2.5 py-1.5 text-[10px] font-semibold text-neutral-dark transition hover:border-accent-medium hover:bg-accent-soft">
          <Pencil className="h-3 w-3" /> Edit
        </Link>
        <ConfirmDeleteButton entityLabel={property.title} pending={isDeleting} onDelete={() => removeProperty(property.id)} />
      </div>,
    },
  ];
}
