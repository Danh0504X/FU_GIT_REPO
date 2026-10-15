import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

export const getAllOrdersService = async () => {
    return await Order.find();
};

export const getAllProductsService = async () => {
    return await Product.find().sort({ productName: 1 });
};

export const getOrderByIdService = async (id) => {
    const order = await Order.findById(id);

    if (!order) {
        throw new Error("Order not found");
    }

    return order;
};

export const createOrderService = async (orderData) => {
    const {
        customerName,
        productName,
        quantity,
        orderDate
    } = orderData;

    // Kiểm tra product có tồn tại không
    const product = await Product.findOne({ productName });

    if (!product) {
        throw new Error("Product does not exist");
    }

    // Tính totalPrice tự động
    const totalPrice = quantity * product.unitPrice;

    const newOrder = await Order.create({
        customerName,
        productName,
        quantity,
        orderDate,
        totalPrice
    });

    return newOrder;
};

export const updateOrderService = async (id, orderData) => {
    const {
        customerName,
        productName,
        quantity,
        orderDate
    } = orderData;

    const currentOrder = await Order.findById(id);

    if (!currentOrder) {
        throw new Error("Order not found");
    }

    // Kiểm tra product mới có tồn tại không
    const product = await Product.findOne({ productName });

    if (!product) {
        throw new Error("Product does not exist");
    }

    // Tính lại totalPrice khi update
    const totalPrice = quantity * product.unitPrice;

    const updatedOrder = await Order.findByIdAndUpdate(
        id,
        {
            customerName,
            productName,
            quantity,
            orderDate,
            totalPrice
        },
        {
            new: true,
            runValidators: true
        }
    );

    return updatedOrder;
};

export const deleteOrderService = async (id) => {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
        throw new Error("Order not found");
    }

    return order;
};