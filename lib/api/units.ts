import { apiClient } from "@/lib/api/client";
import type { PaginatedResult } from "@/lib/api/pagination";
import type { PropertyRecord, PropertyType } from "@/lib/api/properties";

export type UnitStatus = "AVAILABLE" | "OCCUPIED";
export const UNIT_STATUSES = ["AVAILABLE", "OCCUPIED"] as const satisfies readonly UnitStatus[];

export function isUnitStatus(value: string): value is UnitStatus {
  return UNIT_STATUSES.some((status) => status === value);
}

export type UnitRecord = {
  id: number;
  propertyId: number;
  unitNumber: string;
  floor: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  areaSqft: number | null;
  rent: number | string;
  status: UnitStatus;
};

export type PublicRentalListing = UnitRecord & {
  property: Pick<PropertyRecord, "id" | "title" | "propertyType" | "address" | "city" | "state" | "coverImage">;
  images: { imageUrl: string }[];
};

export type UnitImageRecord = {
  id: number;
  unitId: number;
  imageUrl: string;
  isCover: boolean;
};

export type PublicUnitDetail = UnitRecord & {
  property: PropertyRecord;
};

export type PublicRentalFilters = {
  page: number;
  pageSize: number;
  propertyId?: number;
  search?: string;
  propertyTypes?: PropertyType[];
  maxRent?: number;
  bedroomsMin?: number;
};

export type UnitFilters = {
  propertyId?: number;
  status?: UnitStatus;
  unitNumber?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchUnits(filters: UnitFilters, signal?: AbortSignal) {
  const { data } = await apiClient.get<UnitRecord[] | PaginatedResult<UnitRecord>>("/api/unit", { params: filters, signal });
  return data;
}

export async function fetchPublicRentals(filters: PublicRentalFilters, signal?: AbortSignal) {
  const { propertyTypes, ...params } = filters;
  const { data } = await apiClient.get<PaginatedResult<PublicRentalListing>>("/api/unit/public", {
    params: { ...params, ...(propertyTypes?.length ? { propertyTypes: propertyTypes.join(",") } : {}) },
    signal,
  });
  return data;
}

export async function fetchPublicUnitDetail(unitId: number, signal?: AbortSignal) {
  const [unitResponse, imagesResponse] = await Promise.all([
    apiClient.get<PublicUnitDetail>(`/api/unit/${unitId}`, { signal }),
    apiClient.get<UnitImageRecord[]>(`/api/unit/${unitId}/images`, { signal }),
  ]);
  return { unit: unitResponse.data, images: imagesResponse.data };
}

export async function createUnit(payload: Record<string, unknown>) {
  const { data } = await apiClient.post<{ id: number }>("/api/unit", payload);
  return data;
}

export async function updateUnit(id: number, payload: Record<string, unknown>) {
  await apiClient.patch(`/api/unit/${id}`, payload);
}

export async function deleteUnit(id: number) {
  await apiClient.delete(`/api/unit/${id}`);
}

export async function uploadUnitImages(id: number, images: File[]) {
  const formData = new FormData();
  images.forEach((image) => formData.append("images", image));
  await apiClient.post(`/api/unit/${id}/images`, formData);
}

export async function deleteUnitImage(unitId: number, imageId: number) {
  await apiClient.delete(`/api/unit/${unitId}/images/${imageId}`);
}

export async function setUnitImageCover(unitId: number, imageId: number) {
  await apiClient.patch(`/api/unit/${unitId}/images/${imageId}/cover`);
}
