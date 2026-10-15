function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}


function applyDiscount(price, discount) {
    return price - (price * discount / 100);
}


function isValidISBN(isbn) {
    return isbn.length === 13;
}


module.exports = {
    formatPrice,
    applyDiscount,
    isValidISBN
};