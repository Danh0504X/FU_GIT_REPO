import mongoose from "mongoose";


const stockTransactionSchema = new mongoose.Schema({
    // mã tự sinh trong controller, ví dụ: TXN-20261007-001
    transactionCode: {
        type: String,
        required: true,
        unique: true
    },

    type: {
        type: String,
        enum: [
            "import",
            "export",
            "transfer_out",
            "transfer_in"
        ],
        required: true
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    // kho nguồn
    warehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse",
        required: true
    },

    // chỉ dùng cho transfer
    destinationWarehouseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse",
        default: null
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    // giá tại thời điểm giao dịch
    unitPrice: {
        type: Number,
        required: true
    },

    // tự tính = quantity * unitPrice (xem pre-save bên dưới)
    totalValue: {
        type: Number
    },

    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    note: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

stockTransactionSchema.pre("save", function(){
    this.totalValue = this.quantity * this.unitPrice;
});


const StockTransaction = mongoose.model( "StockTransaction", stockTransactionSchema );


export default StockTransaction;
