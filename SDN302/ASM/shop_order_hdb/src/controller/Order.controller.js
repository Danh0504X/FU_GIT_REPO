import {
    getAllOrdersService,
    getOrderByIdService,
    createOrderService,
    updateOrderService,
    deleteOrderService
} from "../services/Order.service.js";

export const getOrders = async (req, res) => {
    try {
        const orders = await getAllOrdersService();

        return res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await getOrderByIdService(req.params.id);

        return res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

export const createOrder = async (req, res) => {
    try {
        const order = await createOrderService(req.body);

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const order = await updateOrderService(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Order updated successfully",
            data: order
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        await deleteOrderService(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};