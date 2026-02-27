import { apiRequest, setCsrfToken } from "./client";
import type { User } from "@/types";

export async function login(email: string, password: string) {
  return apiRequest<{ data: { user: User } }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return apiRequest<{ data: { success: boolean } }>("/api/auth/logout", {
    method: "POST",
  });
}

export async function getMe() {
  const response = await apiRequest<{ data: { user: User; csrfToken: string } }>("/api/auth/me");
  if (response.data.csrfToken) {
    setCsrfToken(response.data.csrfToken);
  }
  return response;
}
