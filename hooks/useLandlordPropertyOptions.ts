"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProperties, type PropertyFilters } from "@/lib/api/properties";

export function useLandlordPropertyOptions(ownerId: number | undefined, enabled: boolean) {
  const filters: PropertyFilters | undefined = ownerId === undefined ? undefined : { ownerId };
  return useQuery({
    queryKey: ["properties", "options", ownerId],
    queryFn: async ({ signal }) => {
      if (!filters) return [];
      const result = await fetchProperties(filters, signal);
      return Array.isArray(result) ? result : result.items;
    },
    enabled: enabled && filters !== undefined,
  });
}
