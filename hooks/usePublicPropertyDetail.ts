"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProperty } from "@/lib/api/properties";
import { fetchPublicRentals } from "@/lib/api/units";

const UNITS_PAGE_SIZE = 6;

export function usePublicPropertyDetail(propertyId: number, page: number) {
  const propertyQuery = useQuery({
    queryKey: ["public-property", propertyId],
    queryFn: ({ signal }) => fetchProperty(propertyId, signal),
    enabled: Number.isSafeInteger(propertyId) && propertyId > 0,
  });
  const unitsQuery = useQuery({
    queryKey: ["public-rentals", { propertyId, page, pageSize: UNITS_PAGE_SIZE }],
    queryFn: ({ signal }) => fetchPublicRentals({ propertyId, page, pageSize: UNITS_PAGE_SIZE }, signal),
    enabled: Number.isSafeInteger(propertyId) && propertyId > 0,
    placeholderData: (previous) => previous,
  });

  return { propertyQuery, unitsQuery, unitsPageSize: UNITS_PAGE_SIZE };
}
