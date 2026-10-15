import {
    formatPrice,
    applyDiscount,
    isValidISBN
} from "./bookUtils.js";


import chalk from "chalk";


const price = 200;

const discountPrice = applyDiscount(price, 10);


console.log(chalk.blue("===== ESM Version ====="));


console.log(
    "Original price:",
    formatPrice(price)
);


console.log(
    "After discount:",
    formatPrice(discountPrice)
);


console.log(
    "ISBN valid:",
    isValidISBN("1234567890123")
);