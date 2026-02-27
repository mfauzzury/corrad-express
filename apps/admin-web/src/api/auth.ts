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

export async function updateProfile(data: { name?: string; email?: string }) {
  return apiRequest<{ data: { user: User } }>("/api/auth/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function changePassword(data: { currentPassword: string; newPassword: string }) {
  return apiRequest<{ data: { message: string } }>("/api/auth/password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest<{ data: { user: User } }>("/api/auth/avatar", {
    method: "POST",
    body: formData,
  });
}

export async function removeAvatar() {
  return apiRequest<{ data: { user: User } }>("/api/auth/avatar", {
    method: "DELETE",
  });
}
