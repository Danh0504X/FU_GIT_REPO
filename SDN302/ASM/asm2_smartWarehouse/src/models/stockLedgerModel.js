import mongoose from "mongoose";


const stockLedgerSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse",
        required: true
    },

    // số lượng hiện có của sản phẩm này trong kho này
    quantity: {
        type: Number,
        required: true,
        min: 0
    },

    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// mỗi cặp (productId + warehouseId) chỉ có 1 dòng
stockLedgerSchema.index(
    { productId: 1, warehouseId: 1 },
    { unique: true }
);


const StockLedger = mongoose.model( "StockLedger", stockLedgerSchema );


export default StockLedger;
