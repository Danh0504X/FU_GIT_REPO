import { getDatabase } from '../config/database';

// Cấu trúc một giao dịch:
// { id, userId, type: 'income' | 'expense', amount, category, date: 'YYYY-MM-DD', note }
export const TRANSACTION_TYPES = ['income', 'expense'];

// Lưu ý: mọi truy vấn bên dưới đều có điều kiện "userId = ?"
// nên mỗi tài khoản chỉ đọc/sửa/xóa được giao dịch của chính mình.

// Lấy danh sách giao dịch, hỗ trợ tìm kiếm theo note/category và lọc theo type/category.
// type = 'all' hoặc category = '' nghĩa là không lọc theo tiêu chí đó.
// Câu SQL chỉ ghép các điều kiện cố định; giá trị người dùng nhập luôn truyền qua tham số "?".
export async function getTransactions(userId, { keyword = '', type = 'all', category = '' } = {}) {
  const conditions = ['userId = ?'];
  const params = [userId];

  if (keyword) {
    conditions.push('(note LIKE ? OR category LIKE ?)');
    params.push(`%${keyword}%`, `%${keyword}%`);
  }
  if (type !== 'all') {
    conditions.push('type = ?');
    params.push(type);
  }
  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }

  const db = await getDatabase();
  return db.getAllAsync(
    `SELECT * FROM transactions WHERE ${conditions.join(' AND ')} ORDER BY date DESC, id DESC`,
    params
  );
}

export async function getTransactionById(userId, transactionId) {
  const db = await getDatabase();
  return db.getFirstAsync('SELECT * FROM transactions WHERE id = ? AND userId = ?', [
    transactionId,
    userId,
  ]);
}

// Danh sách category (không trùng lặp) của user, dùng cho bộ lọc theo category.
export async function getCategories(userId) {
  const db = await getDatabase();
  const rows = await db.getAllAsync(
    'SELECT DISTINCT category FROM transactions WHERE userId = ? ORDER BY category',
    [userId]
  );
  return rows.map((row) => row.category);
}

// Cộng tổng tiền thu và tổng tiền chi của user ngay trong SQLite.
// COALESCE trả về 0 khi user chưa có giao dịch nào thuộc loại đó.
export async function getTotals(userId) {
  const db = await getDatabase();
  return db.getFirstAsync(
    `SELECT
       COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) AS totalIncome,
       COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS totalExpense
     FROM transactions
     WHERE userId = ?`,
    [userId]
  );
}

export async function createTransaction(userId, { type, amount, category, date, note }) {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO transactions (userId, type, amount, category, date, note) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, type, amount, category, date, note]
  );
  return result.lastInsertRowId;
}

export async function updateTransaction(userId, transactionId, { type, amount, category, date, note }) {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE transactions
     SET type = ?, amount = ?, category = ?, date = ?, note = ?
     WHERE id = ? AND userId = ?`,
    [type, amount, category, date, note, transactionId, userId]
  );
}

export async function deleteTransaction(userId, transactionId) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM transactions WHERE id = ? AND userId = ?', [transactionId, userId]);
}
