import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'finance.db';

let databasePromise = null;

// Mở kết nối SQLite một lần duy nhất và dùng lại cho toàn bộ ứng dụng.
export function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }
  return databasePromise;
}

// Tạo các bảng cần thiết khi ứng dụng khởi động.
// "IF NOT EXISTS" giúp dữ liệu cũ được giữ nguyên ở những lần mở app sau.
// Mỗi giao dịch gắn với một userId để tách biệt dữ liệu giữa các tài khoản.
export async function initDatabase() {
  const db = await getDatabase();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      salt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      amount REAL NOT NULL CHECK (amount > 0),
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_userId ON transactions (userId);
  `);
}
