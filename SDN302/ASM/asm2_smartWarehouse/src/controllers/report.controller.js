import Warehouse from "../models/warehouseModel.js";
import StockLedger from "../models/stockLedgerModel.js";
import StockTransaction from "../models/stockTransactionModel.js";


// ===== GET /reports/stock-summary =====
export const stockSummary = async (req, res) => {
    try {
        const { warehouseId } = req.query;

        const filter = {};
        if (warehouseId) {
            filter._id = warehouseId;
        }

        const warehouses = await Warehouse.find(filter);

        const summary = [];

        for (const warehouse of warehouses) {
            // các sản phẩm đang có trong kho này
            const ledgers = await StockLedger
                .find({ warehouseId: warehouse._id })
                .populate("productId", "sku name unit");

            const products = ledgers.map(ledger => ({
                product: ledger.productId,
                quantity: ledger.quantity
            }));

            // làm tròn 1 chữ số thập phân
            const utilizationPercent = Math.round(warehouse.currentLoad / warehouse.maxCapacity * 1000) / 10;

            summary.push({
                warehouseId: warehouse._id,
                warehouseCode: warehouse.code,
                warehouseName: warehouse.name,
                currentLoad: warehouse.currentLoad,
                maxCapacity: warehouse.maxCapacity,
                utilizationPercent,
                products
            });
        }

        return res.status(200).json({
            count: summary.length,
            warehouses: summary
        });

    } catch (error) {
        return res.status(error.name === "CastError" ? 400 : 500).json({
            message: error.message
        });
    }
};


// ===== GET /reports/transactions =====
export const transactionReport = async (req, res) => {
    try {
        const {
            type,
            warehouseId,
            from,
            to
        } = req.query;

        const filter = {};

        if (type) {
            filter.type = type;
        }

        if (warehouseId) {
            filter.warehouseId = warehouseId;
        }

        // lọc theo ngày: từ 00:00 ngày "from" đến 23:59 ngày "to"
        if (from || to) {
            filter.createdAt = {};

            if (from) {
                filter.createdAt.$gte = new Date(from + "T00:00:00");
            }
            if (to) {
                filter.createdAt.$lte = new Date(to + "T23:59:59.999");
            }
        }

        const transactions = await StockTransaction
            .find(filter)
            .populate("productId", "sku name")
            .populate("performedBy", "username fullName")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: transactions.length,
            transactions
        });

    } catch (error) {
        return res.status(error.name === "CastError" ? 400 : 500).json({
            message: error.message
        });
    }
};
