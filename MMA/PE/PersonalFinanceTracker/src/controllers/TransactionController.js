import * as TransactionModel from '../models/TransactionModel';
import { validateTransaction } from '../utils/validation';

// Lấy danh sách giao dịch của user theo từ khóa tìm kiếm và bộ lọc hiện tại.
export function getTransactionList(userId, { keyword, type, category }) {
  return TransactionModel.getTransactions(userId, { keyword: keyword.trim(), type, category });
}

export function getCategories(userId) {
  return TransactionModel.getCategories(userId);
}

export function getTransactionDetail(userId, transactionId) {
  return TransactionModel.getTransactionById(userId, transactionId);
}

// Tính số liệu cho Dashboard của user đang đăng nhập:
// - Tổng thu, tổng chi: SQLite cộng (SUM) số tiền theo từng loại giao dịch.
// - Số dư hiện tại = Tổng thu - Tổng chi.
export async function getSummary(userId) {
  const { totalIncome, totalExpense } = await TransactionModel.getTotals(userId);
  return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
}

// Kiểm tra dữ liệu form rồi thêm mới (không có transactionId) hoặc cập nhật giao dịch.
// Dữ liệu không hợp lệ thì không lưu, trả về { success: false, errors } để View hiển thị lỗi.
export async function saveTransaction(userId, form, transactionId = null) {
  const errors = validateTransaction(form);
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const transaction = {
    type: form.type,
    amount: Number(form.amount),
    category: form.category.trim(),
    date: form.date.trim(),
    note: form.note.trim(),
  };

  if (transactionId) {
    await TransactionModel.updateTransaction(userId, transactionId, transaction);
  } else {
    await TransactionModel.createTransaction(userId, transaction);
  }
  return { success: true, errors: {} };
}

export function deleteTransaction(userId, transactionId) {
  return TransactionModel.deleteTransaction(userId, transactionId);
}
