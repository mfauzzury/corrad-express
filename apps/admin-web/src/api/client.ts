import { API_BASE_URL } from "@/env";

let csrfToken = "";

function buildHeaders(init?: HeadersInit) {
  const headers = new Headers(init ?? {});
  if (!headers.has("Content-Type") && !(init instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (csrfToken) {
    headers.set("x-csrf-token", csrfToken);
  }
  return headers;
}

export function setCsrfToken(token: string) {
  csrfToken = token;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isForm = options.body instanceof FormData;
  const headers = isForm ? new Headers(options.headers) : buildHeaders(options.headers);

  // Always include CSRF token, even for FormData uploads
  if (isForm && csrfToken) {
    headers.set("x-csrf-token", csrfToken);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message || "Request failed");
  }

  return payload;
}
