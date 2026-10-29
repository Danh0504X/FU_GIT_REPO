import { getDatabase } from '../config/database';

// Bảng users: { id, username, passwordHash, salt }.
// Chỉ lưu mã băm của mật khẩu, không bao giờ lưu mật khẩu gốc.

export async function findUserByUsername(username) {
  const db = await getDatabase();
  return db.getFirstAsync('SELECT * FROM users WHERE username = ?', [username]);
}

// Chỉ trả về thông tin công khai của user (không kèm passwordHash, salt).
export async function findUserById(userId) {
  const db = await getDatabase();
  return db.getFirstAsync('SELECT id, username FROM users WHERE id = ?', [userId]);
}

export async function createUser(username, passwordHash, salt) {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO users (username, passwordHash, salt) VALUES (?, ?, ?)',
    [username, passwordHash, salt]
  );
  return result.lastInsertRowId;
}
