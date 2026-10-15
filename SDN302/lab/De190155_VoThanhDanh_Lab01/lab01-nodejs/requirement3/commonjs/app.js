const {
    formatPrice,
    applyDiscount,
    isValidISBN
} = require("./bookUtils.js");

const chalk = require("chalk");

console.log(chalk.green("Book Information"));

console.log(formatPrice(100));

console.log(applyDiscount(100, 20));

console.log(isValidISBN("1234567890123"));