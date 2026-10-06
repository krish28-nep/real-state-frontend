"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicRentals } from "@/lib/api/units";
import type { PropertyType } from "@/lib/api/properties";

const PAGE_SIZE = 9;

export function usePublicRentals() {
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [maxRent, setMaxRent] = useState(0);
  const [debouncedMaxRent, setDebouncedMaxRent] = useState(0);
  const [bedroomsMin, setBedroomsMin] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchTerm(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedMaxRent(maxRent), 350);
    return () => window.clearTimeout(timer);
  }, [maxRent]);

  const query = useQuery({
    queryKey: ["public-rentals", { page, pageSize: PAGE_SIZE, searchTerm, propertyTypes, maxRent: debouncedMaxRent, bedroomsMin }],
    queryFn: ({ signal }) => fetchPublicRentals({
      page,
      pageSize: PAGE_SIZE,
      ...(searchTerm ? { search: searchTerm } : {}),
      ...(propertyTypes.length ? { propertyTypes } : {}),
      ...(debouncedMaxRent > 0 ? { maxRent: debouncedMaxRent } : {}),
      ...(bedroomsMin > 0 ? { bedroomsMin } : {}),
    }, signal),
    placeholderData: (previous) => previous,
  });

  function togglePropertyType(type: PropertyType) {
    setPage(1);
    setPropertyTypes((current) => current.includes(type)
      ? current.filter((value) => value !== type)
      : [...current, type]);
  }

  function clearFilters() {
    setSearch("");
    setSearchTerm("");
    setPropertyTypes([]);
    setMaxRent(0);
    setDebouncedMaxRent(0);
    setBedroomsMin(0);
    setPage(1);
  }

  return {
    ...query,
    records: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    page,
    pageSize: PAGE_SIZE,
    search,
    setSearch: (value: string) => { setSearch(value); setPage(1); },
    propertyTypes,
    togglePropertyType,
    maxRent,
    setMaxRent: (value: number) => { setMaxRent(value); setPage(1); },
    bedroomsMin,
    setBedroomsMin: (value: number) => { setBedroomsMin(value); setPage(1); },
    clearFilters,
    setPage,
  };
}
