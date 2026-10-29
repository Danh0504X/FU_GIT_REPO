import AsyncStorage from "@react-native-async-storage/async-storage";

const CREDENTIALS_KEY = "credentials";

export type Credentials = {
  username: string;
  password: string;
};

// Đăng nhập giả lập: chỉ cần username và password không rỗng
export function isValidCredentials(credentials: Credentials) {
  return (
    credentials.username.trim() !== "" &&
    credentials.password.trim() !== ""
  );
}

export async function saveCredentials(credentials: Credentials) {
  await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
}

export async function getCredentials(): Promise<Credentials | null> {
  const value = await AsyncStorage.getItem(CREDENTIALS_KEY);

  if (value === null) {
    return null;
  }

  try {
    return JSON.parse(value) as Credentials;
  } catch {
    return null;
  }
}

export async function clearCredentials() {
  await AsyncStorage.removeItem(CREDENTIALS_KEY);
}
