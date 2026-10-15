import {
    getAllOrdersService,
    getAllProductsService,
    getOrderByIdService,
    createOrderService,
    updateOrderService,
    deleteOrderService
} from "../services/Order.service.js";

export const renderOrders = async (req, res) => {
    try {
        const orders = await getAllOrdersService();

        res.render("order", {
            orders
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const renderCreateOrder = async (req, res) => {
    try {
        const products = await getAllProductsService();

        res.render("createOrder", {
            products
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const handleCreateOrder = async (req, res) => {
    try {
        await createOrderService(req.body);

        res.redirect("/orders");
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const renderUpdateOrder = async (req, res) => {
    try {
        const order = await getOrderByIdService(req.params.id);
        const products = await getAllProductsService();

        res.render("updateOrder", {
            order,
            products
        });
    } catch (error) {
        res.status(404).send(error.message);
    }
};

export const handleUpdateOrder = async (req, res) => {
    try {
        await updateOrderService(
            req.params.id,
            req.body
        );

        res.redirect("/orders");
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const handleDeleteOrder = async (req, res) => {
    try {
        await deleteOrderService(req.params.id);

        res.redirect("/orders");
    } catch (error) {
        res.status(404).send(error.message);
    }
};