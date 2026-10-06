"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth/AuthContext";
import { fetchProperties, type PropertyFilters, type PropertyRecord, type PropertyStatus, type PropertyType } from "@/lib/api/properties";
import type { PaginatedResult } from "@/lib/api/pagination";

const PAGE_SIZE = 4;

export function useLandlordProperties() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType | "">("");
  const [status, setStatus] = useState<PropertyStatus | "">("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => { setSearchTerm(search.trim()); setPage(1); }, 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const query = useQuery({
    queryKey: ["properties", "list", user?.id, { page, pageSize: PAGE_SIZE, searchTerm, propertyType, status }],
    queryFn: async ({ signal }) => {
      const filters: PropertyFilters = {
        ownerId: user!.id,
        page,
        pageSize: PAGE_SIZE,
        ...(searchTerm ? { title: searchTerm } : {}),
        ...(propertyType ? { propertyType } : {}),
        ...(status ? { status } : {}),
      };
      const result = await fetchProperties(filters, signal);
      return Array.isArray(result)
        ? { items: result, total: result.length, page: 1, pageSize: result.length || PAGE_SIZE, totalPages: 1 }
        : result as PaginatedResult<PropertyRecord>;
    },
    enabled: !isAuthLoading && Boolean(user?.id),
    placeholderData: (previous) => previous,
  });

  return { ...query, user, isAuthLoading, search, setSearch, propertyType, setPropertyType, status, setStatus, page, setPage, pageSize: PAGE_SIZE, records: query.data?.items ?? [], total: query.data?.total ?? 0 };
}
