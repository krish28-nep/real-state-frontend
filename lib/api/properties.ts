import { apiClient } from "@/lib/api/client";
import type { PaginatedResult } from "@/lib/api/pagination";
export type { PaginatedResult } from "@/lib/api/pagination";

export type PropertyStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
export type PropertyType = "APARTMENT" | "HOUSE" | "COMMERCIAL" | "ROOM";
export const PROPERTY_STATUSES = ["AVAILABLE", "OCCUPIED", "MAINTENANCE"] as const satisfies readonly PropertyStatus[];
export const PROPERTY_TYPES = ["APARTMENT", "HOUSE", "COMMERCIAL", "ROOM"] as const satisfies readonly PropertyType[];
export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  APARTMENT: "Apartment",
  HOUSE: "House",
  COMMERCIAL: "Commercial",
  ROOM: "Room",
};
export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  MAINTENANCE: "Maintenance",
};

export function isPropertyType(value: string): value is PropertyType {
  return PROPERTY_TYPES.some((type) => type === value);
}

export function isPropertyStatus(value: string): value is PropertyStatus {
  return PROPERTY_STATUSES.some((status) => status === value);
}

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
  page?: number;
  pageSize?: number;
};

export async function fetchProperties(filters: PropertyFilters, signal?: AbortSignal) {
  const { data } = await apiClient.get<PropertyRecord[] | PaginatedResult<PropertyRecord>>("/api/property", { params: filters, signal });
  return data;
}

export async function fetchProperty(id: number, signal?: AbortSignal) {
  const { data } = await apiClient.get<PropertyRecord | null>(`/api/property/${id}`, { signal });
  return data;
}

export async function createProperty(payload: Record<string, unknown>) {
  const { data } = await apiClient.post<{ id: number }>("/api/property", payload);
  return data;
}

export async function updateProperty(id: number, payload: Record<string, unknown>) {
  await apiClient.patch(`/api/property/${id}`, payload);
}

export async function deleteProperty(id: number) {
  await apiClient.delete(`/api/property/${id}`);
}

export async function uploadPropertyCover(id: number, image: File) {
  const formData = new FormData();
  formData.append("image", image);
  await apiClient.post(`/api/property/${id}/cover-image`, formData);
}
