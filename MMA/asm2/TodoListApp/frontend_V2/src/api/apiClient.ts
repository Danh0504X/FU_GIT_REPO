import { API_URL, REQUEST_TIMEOUT_MS } from "../config/api";

export class ApiError extends Error {
  // 0 = không kết nối được server
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Token hiện tại chỉ nằm trong bộ nhớ. Có "Remember" thì AuthContext lưu thêm vào AsyncStorage.
let authToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

// AuthContext đăng ký hàm này để tự đăng xuất khi server báo token hết hạn / bị thu hồi        
export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

// Backend luôn trả { status, message, data } khi thành công và { statusCode, message } khi lỗi
export async function apiRequest<T>(
  path: string,
  { method = "GET", body }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(
      0,
      `Không kết nối được server (${API_URL}). Kiểm tra backend đã chạy và địa chỉ trong .env.`
    );
  } finally {
    clearTimeout(timeout);
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    // Chỉ coi là "hết phiên" khi request có gửi token (login sai mật khẩu cũng trả 401)
    if (response.status === 401 && authToken) {
      unauthorizedHandler?.();
    }
    throw new ApiError(
      response.status,
      json?.message ?? `Request failed (${response.status})`
    );
  }

  return json?.data as T;
}
