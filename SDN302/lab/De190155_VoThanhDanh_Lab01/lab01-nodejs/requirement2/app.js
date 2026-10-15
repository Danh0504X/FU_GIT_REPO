
const os = require("os");
const path = require("path");

console.log("Võ Thành Danh - DE190155 - 9/7/2026");

const num1 = Number(process.argv[2]);
const num2 = Number(process.argv[3]);

const sum = num1 + num2;
const difference = num1 - num2;
const product = num1 * num2;
const quotient = num1 / num2;


console.log("===== Calculator Results =====");
console.log("Sum:", sum);
console.log("Difference:", difference);
console.log("Product:", product);
console.log("Quotient:", quotient);

console.log("\n===== System Information =====");
console.log("Platform:", os.platform());
console.log("CPU Count:", os.cpus().length);
console.log(
    "Free Memory:",
    (os.freemem() / 1024 / 1024 / 1024).toFixed(2),
    "GB"
);

console.log(
    "Current File Path:",
    path.resolve(__filename)
);