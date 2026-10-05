import { apiClient } from "@/lib/api/client";

export type PropertyStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
export type PropertyType = "APARTMENT" | "HOUSE" | "COMMERCIAL" | "ROOM";

export type PropertyRecord = {
  id: number;
  ownerId: number;
  title: string;
  description: string | null;
  propertyType: PropertyType;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  status: PropertyStatus;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PropertyFilters = {
  ownerId: number;
  title?: string;
  status?: PropertyStatus;
  propertyType?: PropertyType;
};

export async function fetchProperties(filters: PropertyFilters, signal?: AbortSignal) {
  const { data } = await apiClient.get<PropertyRecord[]>("/api/property", { params: filters, signal });
  return data;
}
