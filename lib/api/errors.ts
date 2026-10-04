import { isAxiosError } from "axios";

interface ApiErrorResponse {
  message?: string | string[];
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) return fallback;

  const responseMessage = (error.response?.data as ApiErrorResponse | undefined)?.message;
  if (Array.isArray(responseMessage)) return responseMessage.join(" ");
  return responseMessage || fallback;
}