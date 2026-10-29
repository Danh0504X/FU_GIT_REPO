import { TRANSACTION_TYPES } from '../models/TransactionModel';

// Kiểm tra chuỗi ngày dạng YYYY-MM-DD và phải là ngày có thật.
// Ví dụ "2025-02-30" đúng định dạng nhưng không tồn tại nên không hợp lệ:
// new Date sẽ tự đẩy sang tháng 3, nên ta so sánh lại năm/tháng/ngày.
export function isValidDate(dateText) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
    return false;
  }
  const [year, month, day] = dateText.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

// Kiểm tra dữ liệu form giao dịch (các giá trị đều ở dạng chuỗi lấy từ TextInput).
// Trả về object chứa thông báo lỗi theo từng trường; object rỗng nghĩa là hợp lệ.
export function validateTransaction({ type, amount, category, date }) {
  const errors = {};
  const amountNumber = Number(amount);

  if (!TRANSACTION_TYPES.includes(type)) {
    errors.type = 'Please choose Income or Expense.';
  }
  if (!amount.trim()) {
    errors.amount = 'Amount is required.';
  } else if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
    errors.amount = 'Amount must be a number greater than 0.';
  }
  if (!category.trim()) {
    errors.category = 'Category is required.';
  }
  if (!isValidDate(date.trim())) {
    errors.date = 'Please enter a valid date (YYYY-MM-DD).';
  }
  return errors;
}
