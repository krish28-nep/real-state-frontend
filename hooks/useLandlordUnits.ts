"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/AuthContext";
import { fetchUnits, type UnitFilters, type UnitRecord, type UnitStatus } from "@/lib/api/units";
import type { PaginatedResult } from "@/lib/api/pagination";

const PAGE_SIZE = 8;

export function useLandlordUnits(propertyId?: number) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<UnitStatus | "">("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => { setSearchTerm(search.trim()); setPage(1); }, 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const query = useQuery({
    queryKey: ["units", "list", user?.id, { page, pageSize: PAGE_SIZE, propertyId, searchTerm, status }],
    queryFn: async ({ signal }) => {
      const filters: UnitFilters = { page, pageSize: PAGE_SIZE, ...(propertyId ? { propertyId } : {}), ...(searchTerm ? { unitNumber: searchTerm } : {}), ...(status ? { status } : {}) };
      const result = await fetchUnits(filters, signal);
      return Array.isArray(result)
        ? { items: result, total: result.length, page: 1, pageSize: result.length || PAGE_SIZE, totalPages: 1 }
        : result as PaginatedResult<UnitRecord>;
    },
    enabled: !isAuthLoading && Boolean(user?.id),
    placeholderData: (previous) => previous,
  });

  return { ...query, user, isAuthLoading, search, setSearch, status, setStatus, page, setPage, pageSize: PAGE_SIZE, records: query.data?.items ?? [], total: query.data?.total ?? 0 };
}
