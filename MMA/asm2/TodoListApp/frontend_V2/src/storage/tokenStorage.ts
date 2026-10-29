import AsyncStorage from "@react-native-async-storage/async-storage";

// Chỉ lưu token (không lưu mật khẩu) và chỉ khi người dùng chọn "Remember Password"
const TOKEN_KEY = "authToken";

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function clearToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}
