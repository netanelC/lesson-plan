import axios from "axios";

const api = axios.create({
  // Fallback to our backend port if the env var isn't set yet
  baseURL:
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
    "http://localhost:8080/api",
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    return Promise.reject(error);
  },
);

export function extractApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const serverError = error.response?.data?.error as string | undefined;
    if (serverError != null) return serverError;
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred.";
}

export { api };
