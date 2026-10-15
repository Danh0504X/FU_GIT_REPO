import Product from "../models/productModel.js";
import StockLedger from "../models/stockLedgerModel.js";
import { fail, positiveNumber } from "../utils/http.js";

export async function createProduct(req, res) {
    const { sku, name, category, unit, unitPrice, reorderLevel } = req.body ?? {};
    if (![sku, name, category, unit].every(value => typeof value === "string" && value.trim())) {
        fail(400, "sku, name, category and unit are required strings");
    }
    positiveNumber(unitPrice, "unitPrice");
    if (typeof reorderLevel !== "number" || !Number.isFinite(reorderLevel) || reorderLevel < 0) {
        fail(400, "reorderLevel must be a non-negative number");
    }
    if (await Product.exists({ sku: sku.trim() })) fail(409, "SKU already exists");
    const product = await Product.create({ sku, name, category, unit, unitPrice, reorderLevel });
    res.status(201).json({ message: "Product created successfully", product });
}
export async function getProducts(req, res) {
    const { category, lowStock } = req.query;
    if (category !== undefined && typeof category !== "string") fail(400, "category must be a string");
    if (lowStock !== undefined && !["true", "false"].includes(lowStock)) fail(400, "lowStock must be true or false");
    let products = await Product.find(category === undefined ? {} : { category }).lean();
    if (lowStock === "true") {
        const ledgers = await StockLedger.find().lean();
        const stock = new Map();
        for (const ledger of ledgers) {
            const key = String(ledger.productId);
            stock.set(key, (stock.get(key) ?? 0) + ledger.quantity);
        }
        products = products.filter(product => (stock.get(String(product._id)) ?? 0) < product.reorderLevel);
    }
    res.json({ count: products.length, products });
}
