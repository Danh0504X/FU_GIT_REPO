import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { initDatabase } from '../config/database';
import * as UserModel from '../models/UserModel';

const SESSION_KEY = 'auth_session';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

// Hai tài khoản demo để chạy thử.
const DEMO_ACCOUNTS = [
  { username: 'alice', password: 'alice123' },
  { username: 'bob', password: 'bob123' },
];


function hashPassword(password, salt) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
}

// Tạo tài khoản demo nếu chưa tồn tại
async function seedDemoAccounts() {
  for (const account of DEMO_ACCOUNTS) {
    const existingUser = await UserModel.findUserByUsername(account.username);
    if (!existingUser) {
      const salt = Crypto.randomUUID();
      const passwordHash = await hashPassword(account.password, salt);
      await UserModel.createUser(account.username, passwordHash, salt);
    }
  }
}

// Đọc phiên đã lưu trong AsyncStorage
async function readSession() {
  try {
    const sessionJson = await AsyncStorage.getItem(SESSION_KEY);
    return sessionJson ? JSON.parse(sessionJson) : null;
  } catch {
    return null;
  }
}

// Khôi phục phiên đăng nhập khi ứng dụng khởi động.

async function restoreSession() {
  const session = await readSession();
  const isSessionValid = session !== null && session.expiresAt > Date.now();
  const user = isSessionValid ? await UserModel.findUserById(session.userId) : null;

  if (!user) {
    await logout();
    return null;
  }
  return user;
}

// Chuẩn bị khi app khởi động: tạo bảng, tạo tài khoản demo,
// rồi trả về user của phiên cũ (hoặc null nếu cần đăng nhập lại).
export async function initializeAuth() {
  await initDatabase();
  await seedDemoAccounts();
  return restoreSession();
}

// Đăng nhập: tìm user theo username, băm mật khẩu vừa nhập với salt đã lưu
// rồi so sánh với mã băm trong database.
// Thành công thì lưu phiên (chỉ userId và thời điểm hết hạn, không lưu mật khẩu) vào AsyncStorage.
export async function login(username, password) {
  const normalizedUsername = username.trim().toLowerCase();
  if (!normalizedUsername || !password) {
    return { success: false, message: 'Please enter both username and password.' };
  }

  const user = await UserModel.findUserByUsername(normalizedUsername);
  const passwordHash = user ? await hashPassword(password, user.salt) : null;
  if (!user || passwordHash !== user.passwordHash) {
    return { success: false, message: 'Invalid username or password.' };
  }

  const session = { userId: user.id, expiresAt: Date.now() + SESSION_DURATION_MS };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user: { id: user.id, username: user.username } };
}

// Đăng xuất: xóa phiên đã lưu để lần mở app sau phải đăng nhập lại.
export async function logout() {
  await AsyncStorage.removeItem(SESSION_KEY);
}
