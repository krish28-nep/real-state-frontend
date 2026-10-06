"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { showErrorToast } from "@/lib/api/toasts";
import { createProperty, deleteProperty, updateProperty, uploadPropertyCover } from "@/lib/api/properties";
import { createUnit, deleteUnit, deleteUnitImage, setUnitImageCover, updateUnit, uploadUnitImages } from "@/lib/api/units";

type FormPayload = Record<string, unknown>;

async function tryUploadPropertyCover(id: number, image?: File | null) {
  if (!image) return true;
  try {
    await uploadPropertyCover(id, image);
    return true;
  } catch {
    toast.error("The property was saved, but its cover image could not be uploaded.");
    return false;
  }
}

async function tryUploadUnitImages(id: number, images?: File[]) {
  if (!images?.length) return true;
  try {
    await uploadUnitImages(id, images);
    return true;
  } catch {
    toast.error("The unit was saved, but its photos could not be uploaded.");
    return false;
  }
}

export function usePropertyMutations() {
  const queryClient = useQueryClient();
  const onSuccess = async (message: string) => {
    await queryClient.invalidateQueries({ queryKey: ["properties"] });
    await queryClient.invalidateQueries({ queryKey: ["units"] });
    toast.success(message);
  };
  const create = useMutation({
    mutationFn: async ({ payload, image }: { payload: FormPayload; image?: File | null }) => {
      const data = await createProperty(payload);
      const imageUploaded = await tryUploadPropertyCover(data.id, image);
      return { data, imageUploaded };
    },
    onSuccess: () => onSuccess("Property created."),
    onError: showErrorToast,
  });
  const update = useMutation({
    mutationFn: async ({ id, payload, image }: { id: number; payload: FormPayload; image?: File | null }) => {
      await updateProperty(id, payload);
      const imageUploaded = await tryUploadPropertyCover(id, image);
      return { imageUploaded };
    },
    onSuccess: () => onSuccess("Property updated."),
    onError: showErrorToast,
  });
  const remove = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => onSuccess("Property deleted."),
    onError: showErrorToast,
  });
  return { create, update, remove };
}

export function useUnitMutations() {
  const queryClient = useQueryClient();
  const onSuccess = async (message: string) => {
    await queryClient.invalidateQueries({ queryKey: ["units"] });
    toast.success(message);
  };
  const create = useMutation({
    mutationFn: async ({ payload, images }: { payload: FormPayload; images?: File[] }) => {
      const data = await createUnit(payload);
      const imagesUploaded = await tryUploadUnitImages(data.id, images);
      return { data, imagesUploaded };
    },
    onSuccess: () => onSuccess("Unit created."),
    onError: showErrorToast,
  });
  const update = useMutation({
    mutationFn: async ({ id, payload, images }: { id: number; payload: FormPayload; images?: File[] }) => {
      await updateUnit(id, payload);
      const imagesUploaded = await tryUploadUnitImages(id, images);
      return { imagesUploaded };
    },
    onSuccess: () => onSuccess("Unit updated."),
    onError: showErrorToast,
  });
  const remove = useMutation({
    mutationFn: deleteUnit,
    onSuccess: () => onSuccess("Unit deleted."),
    onError: showErrorToast,
  });
  const removeImage = useMutation({
    mutationFn: ({ unitId, imageId }: { unitId: number; imageId: number }) => deleteUnitImage(unitId, imageId),
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ["unit", variables.unitId] }),
    onError: showErrorToast,
  });
  const setCover = useMutation({
    mutationFn: ({ unitId, imageId }: { unitId: number; imageId: number }) => setUnitImageCover(unitId, imageId),
    onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: ["unit", variables.unitId] }),
    onError: showErrorToast,
  });
  return { create, update, remove, removeImage, setCover };
}
