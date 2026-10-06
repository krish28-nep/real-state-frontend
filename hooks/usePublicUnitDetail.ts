"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPublicUnitDetail } from "@/lib/api/units";

export function usePublicUnitDetail(unitId: number) {
  return useQuery({
    queryKey: ["public-unit", unitId],
    queryFn: ({ signal }) => fetchPublicUnitDetail(unitId, signal),
    enabled: Number.isSafeInteger(unitId) && unitId > 0,
  });
}
