import { apiRequest } from "./apiClient";

export type User = {
  _id: string;
  username: string;
};

export type LoginResult = {
  token: string;
  expiresAt: string;
  rememberMe: boolean;
  userInfo: User;
};

export async function login(
  username: string,
  password: string,
  rememberMe: boolean
) {
  return apiRequest<LoginResult>("/auth/login", {
    method: "POST",
    body: { username, password, rememberMe },
  });
}

export async function register(username: string, password: string) {
  const data = await apiRequest<{ userInfo: User }>("/auth/register", {
    method: "POST",
    body: { username, password },
  });
  return data.userInfo;
}

// Kiểm tra token đang dùng còn hợp lệ không (dùng cho auto-login)
export async function getMe() {
  const data = await apiRequest<{ userInfo: User }>("/auth/me");
  return data.userInfo;
}

// Server xoá session nên token này không dùng được nữa
export async function logout() {
  await apiRequest<void>("/auth/logout", { method: "POST" });
}
