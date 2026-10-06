import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/errors";

export function showErrorToast(error: unknown) {
  toast.error(getApiErrorMessage(error, "Something went wrong. Please try again."));
}
