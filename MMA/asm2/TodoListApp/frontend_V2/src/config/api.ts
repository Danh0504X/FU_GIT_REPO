// Địa chỉ backend, đặt trong file .env (biến EXPO_PUBLIC_ được Expo nhúng vào app lúc build).
// Điện thoại thật / emulator không dùng được "localhost": phải dùng IP LAN của máy chạy backend.
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3001/api";

// Quá thời gian này mà server không trả lời thì báo lỗi (tránh treo khi sai IP)
export const REQUEST_TIMEOUT_MS = 10000;
