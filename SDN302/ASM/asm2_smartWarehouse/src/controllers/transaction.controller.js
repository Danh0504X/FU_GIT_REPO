import Product from "../models/productModel.js";
import Warehouse from "../models/warehouseModel.js";
import StockLedger from "../models/stockLedgerModel.js";
import StockTransaction from "../models/stockTransactionModel.js";


// ===== Các hàm hỗ trợ =====

// Tạo mã giao dịch dạng PREFIX-YYYYMMDD-XXX (XXX là số thứ tự trong ngày)
const generateCode = async (prefix) => {
    const now = new Date();
    const date = now.getFullYear()
        + String(now.getMonth() + 1).padStart(2, "0")
        + String(now.getDate()).padStart(2, "0");

    const codePrefix = `${prefix}-${date}-`;

    // tìm mã lớn nhất trong ngày để lấy số tiếp theo
    const lastTransaction = await StockTransaction
        .findOne({ transactionCode: { $regex: "^" + codePrefix } })
        .sort({ transactionCode: -1 });

    let number = 1;
    if (lastTransaction) {
        const lastNumber = lastTransaction.transactionCode.slice(codePrefix.length, codePrefix.length + 3);
        number = Number(lastNumber) + 1;
    }

    return codePrefix + String(number).padStart(3, "0");
};

// Tổng tồn kho của 1 sản phẩm ở tất cả các kho
const getTotalStock = async (productId) => {
    const ledgers = await StockLedger.find({ productId });

    let total = 0;
    for (const ledger of ledgers) {
        total += ledger.quantity;
    }
    return total;
};

// Cập nhật status của kho sau khi currentLoad thay đổi
const updateWarehouseStatus = (warehouse) => {
    if (warehouse.currentLoad >= warehouse.maxCapacity) {
        warehouse.status = "full";
    } else if (warehouse.status === "full") {
        warehouse.status = "active";
    }
};

// Cộng thêm hàng vào StockLedger (chưa có thì tạo mới)
const addToLedger = async (productId, warehouseId, quantity) => {
    const ledger = await StockLedger.findOne({ productId, warehouseId });

    if (ledger) {
        ledger.quantity += quantity;
        ledger.lastUpdated = Date.now();
        await ledger.save();
    } else {
        await StockLedger.create({ productId, warehouseId, quantity });
    }
};


// ===== POST /transactions/import =====
export const importStock = async (req, res) => {
    try {
        const {
            productId,
            warehouseId,
            quantity,
            unitPrice,
            note
        } = req.body ?? {};

        if (typeof quantity !== "number" || quantity <= 0) {
            return res.status(400).json({
                message: "quantity must be greater than 0"
            });
        }

        if (typeof unitPrice !== "number" || unitPrice <= 0) {
            return res.status(400).json({
                message: "unitPrice must be greater than 0"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        if (!product.isActive) {
            return res.status(400).json({
                message: "Product is not active"
            });
        }

        const warehouse = await Warehouse.findById(warehouseId);
        if (!warehouse) {
            return res.status(404).json({
                message: "Warehouse not found"
            });
        }
        if (warehouse.status !== "active") {
            return res.status(400).json({
                message: "Warehouse is not active"
            });
        }

        // kiểm tra sức chứa của kho
        if (warehouse.currentLoad + quantity > warehouse.maxCapacity) {
            return res.status(409).json({
                message: `Insufficient warehouse capacity. Available: ${warehouse.maxCapacity - warehouse.currentLoad} units`
            });
        }

        // 1. cộng tồn kho
        await addToLedger(productId, warehouseId, quantity);

        // 2. cộng currentLoad của kho
        warehouse.currentLoad += quantity;
        updateWarehouseStatus(warehouse);
        await warehouse.save();

        // 3. tạo giao dịch (performedBy lấy từ JWT)
        const transaction = await StockTransaction.create({
            transactionCode: await generateCode("TXN"),
            type: "import",
            productId,
            warehouseId,
            quantity,
            unitPrice,
            performedBy: req.user.id,
            note
        });

        return res.status(201).json({
            message: "Stock imported successfully",
            transaction
        });

    } catch (error) {
        return res.status(error.name === "CastError" ? 400 : 500).json({
            message: error.message
        });
    }
};


// ===== POST /transactions/export =====
export const exportStock = async (req, res) => {
    try {
        const {
            productId,
            warehouseId,
            quantity,
            note
        } = req.body ?? {};

        if (typeof quantity !== "number" || quantity <= 0) {
            return res.status(400).json({
                message: "quantity must be greater than 0"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        if (!product.isActive) {
            return res.status(400).json({
                message: "Product is not active"
            });
        }

        const warehouse = await Warehouse.findById(warehouseId);
        if (!warehouse) {
            return res.status(404).json({
                message: "Warehouse not found"
            });
        }
        // kho "full" vẫn được xuất hàng, chỉ chặn kho "inactive"
        if (warehouse.status === "inactive") {
            return res.status(400).json({
                message: "Warehouse is not active"
            });
        }

        // kiểm tra tồn kho
        const ledger = await StockLedger.findOne({ productId, warehouseId });
        const available = ledger ? ledger.quantity : 0;

        if (available < quantity) {
            return res.status(409).json({
                message: `Insufficient stock. Available: ${available} units, requested: ${quantity}`
            });
        }

        // 1. trừ tồn kho
        ledger.quantity -= quantity;
        ledger.lastUpdated = Date.now();
        await ledger.save();

        // 2. trừ currentLoad của kho
        warehouse.currentLoad -= quantity;
        updateWarehouseStatus(warehouse);
        await warehouse.save();

        // 3. tạo giao dịch, giá lấy theo giá hiện tại của sản phẩm
        const transaction = await StockTransaction.create({
            transactionCode: await generateCode("TXN"),
            type: "export",
            productId,
            warehouseId,
            quantity,
            unitPrice: product.unitPrice,
            performedBy: req.user.id,
            note
        });

        const response = {
            message: "Stock exported successfully",
            transaction
        };

        // cảnh báo nếu tổng tồn kho thấp hơn reorderLevel
        const totalStock = await getTotalStock(productId);
        if (totalStock < product.reorderLevel) {
            response.lowStockWarning = {
                warning: `Low stock alert: ${product.name} is below reorder level (${product.reorderLevel} units)`
            };
        }

        return res.status(201).json(response);

    } catch (error) {
        return res.status(error.name === "CastError" ? 400 : 500).json({
            message: error.message
        });
    }
};


// ===== POST /transactions/transfer =====
export const transferStock = async (req, res) => {
    try {
        const {
            productId,
            sourceWarehouseId,
            destinationWarehouseId,
            quantity,
            note
        } = req.body ?? {};

        if (typeof quantity !== "number" || quantity <= 0) {
            return res.status(400).json({
                message: "quantity must be greater than 0"
            });
        }

        if (sourceWarehouseId === destinationWarehouseId) {
            return res.status(400).json({
                message: "Source and destination warehouse cannot be the same"
            });
        }

        const sourceWarehouse = await Warehouse.findById(sourceWarehouseId);
        const destinationWarehouse = await Warehouse.findById(destinationWarehouseId);

        if (!sourceWarehouse || !destinationWarehouse) {
            return res.status(404).json({
                message: "Warehouse not found"
            });
        }
        if (sourceWarehouse.status === "inactive" || destinationWarehouse.status === "inactive") {
            return res.status(400).json({
                message: "Warehouse is not active"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        if (!product.isActive) {
            return res.status(400).json({
                message: "Product is not active"
            });
        }

        // kiểm tra cả 2 điều kiện trước khi ghi dữ liệu
        const sourceLedger = await StockLedger.findOne({ productId, warehouseId: sourceWarehouseId });

        if (!sourceLedger || sourceLedger.quantity < quantity) {
            return res.status(409).json({
                message: "Insufficient stock in source warehouse"
            });
        }

        if (destinationWarehouse.currentLoad + quantity > destinationWarehouse.maxCapacity) {
            return res.status(409).json({
                message: "Destination warehouse has insufficient capacity"
            });
        }

        // 1. kho nguồn: trừ hàng
        sourceLedger.quantity -= quantity;
        sourceLedger.lastUpdated = Date.now();
        await sourceLedger.save();

        sourceWarehouse.currentLoad -= quantity;
        updateWarehouseStatus(sourceWarehouse);
        await sourceWarehouse.save();

        // 2. kho đích: cộng hàng
        await addToLedger(productId, destinationWarehouseId, quantity);

        destinationWarehouse.currentLoad += quantity;
        updateWarehouseStatus(destinationWarehouse);
        await destinationWarehouse.save();

        // 3. tạo 2 giao dịch dùng chung mã TRF-YYYYMMDD-XXX
        const code = await generateCode("TRF");

        const transferOut = await StockTransaction.create({
            transactionCode: code + "-OUT",
            type: "transfer_out",
            productId,
            warehouseId: sourceWarehouseId,
            destinationWarehouseId,
            quantity,
            unitPrice: product.unitPrice,
            performedBy: req.user.id,
            note
        });

        const transferIn = await StockTransaction.create({
            transactionCode: code + "-IN",
            type: "transfer_in",
            productId,
            warehouseId: sourceWarehouseId,
            destinationWarehouseId,
            quantity,
            unitPrice: product.unitPrice,
            performedBy: req.user.id,
            note
        });

        return res.status(201).json({
            message: "Stock transferred successfully",
            transactions: [transferOut, transferIn]
        });

    } catch (error) {
        return res.status(error.name === "CastError" ? 400 : 500).json({
            message: error.message
        });
    }
};
