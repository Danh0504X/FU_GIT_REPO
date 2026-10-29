// Định dạng số tiền: thêm dấu phẩy hàng nghìn, chỉ hiện phần thập phân khi có.
// Ví dụ: 1500000 -> "1,500,000 ₫", 12.5 -> "12.50 ₫", -300 -> "-300 ₫".
export function formatMoney(value) {
  // Làm tròn 2 chữ số trước để tránh sai số số thực (vd: 0.1 + 0.2).
  const rounded = Math.round(value * 100) / 100;
  const [integerPart, decimalPart] = Math.abs(rounded).toFixed(2).split('.');
  const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const sign = rounded < 0 ? '-' : '';
  const decimals = decimalPart === '00' ? '' : `.${decimalPart}`;
  return `${sign}${groupedInteger}${decimals} ₫`;
}

// Ngày hôm nay theo giờ của máy, dạng YYYY-MM-DD (cùng định dạng lưu trong database).
export function getTodayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
