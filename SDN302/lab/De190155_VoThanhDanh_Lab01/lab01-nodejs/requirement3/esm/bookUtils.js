export function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}


export function applyDiscount(price, discount) {
    return price - (price * discount / 100);
}


export function isValidISBN(isbn) {
    return isbn.length === 13;
}