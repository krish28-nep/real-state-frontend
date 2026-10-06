"use client";

import Link from "next/link";
import { ConfirmDeleteButton } from "@/components/landlord/ConfirmDeleteButton";
import type { EntityColumn } from "@/components/landlord/EntityTable";
import type { PropertyRecord } from "@/lib/api/properties";
import type { UnitRecord } from "@/lib/api/units";
import { Pencil } from "lucide-react";

export function unitColumns(
  properties: PropertyRecord[],
  removeUnit: (id: number) => void,
  isDeleting: boolean,
): EntityColumn<UnitRecord>[] {
  return [
    { id: "unit", header: "Unit", cell: (unit) => <Link href={`/property/${unit.propertyId}/unit/${unit.id}`} className="font-semibold text-neutral-deep hover:underline">Unit {unit.unitNumber}</Link> },
    {
      id: "property",
      header: "Property",
      cell: (unit) => {
        const property = properties.find(({ id }) => id === unit.propertyId);
        return <>
          <span className="block whitespace-nowrap font-medium">{property?.title ?? "Property"}</span>
          <span className="text-[9px] text-neutral-medium">{property?.city ?? ""}</span>
        </>;
      },
    },
    { id: "layout", header: "Beds / Baths", cell: (unit) => <span className="text-neutral-600">{unit.bedrooms ?? "—"} bed · {unit.bathrooms ?? "—"} bath</span> },
    { id: "floor", header: "Floor", cell: (unit) => unit.floor ?? "—" },
    { id: "area", header: "Area", cell: (unit) => unit.areaSqft == null ? "—" : `${unit.areaSqft.toLocaleString()} sqft` },
    {
      id: "rent",
      header: "Monthly rent",
      cell: (unit) => <span className="font-semibold">${Number(unit.rent).toLocaleString()}<span className="font-normal text-neutral-medium"> / mo</span></span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (unit) => <span className={`rounded-full px-2 py-1 text-[9px] font-semibold uppercase ${unit.status === "AVAILABLE" ? "bg-success-light text-success-dark" : "bg-primary-status-light text-primary-status-dark"}`}>{unit.status === "AVAILABLE" ? "Available" : "Occupied"}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      cell: (unit) => <div className="flex justify-end gap-1.5">
        <Link href={`/landlord/units/${unit.id}/edit`} aria-label={`Edit unit ${unit.unitNumber}`} className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-2.5 py-1.5 text-[10px] font-semibold text-neutral-dark hover:border-accent-medium hover:bg-accent-soft">
          <Pencil className="h-3 w-3" /> Edit
        </Link>
        <ConfirmDeleteButton entityLabel={`Unit ${unit.unitNumber}`} pending={isDeleting} onDelete={() => removeUnit(unit.id)} />
      </div>,
    },
  ];
}
