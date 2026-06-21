const express = require("express");

const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrderById,
    getOrdersByCustomer,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    getPendingOrders,
    getTodayDeliveries,
    getOverdueOrders,
    getDashboardSummary
} = require(
    "../controllers/order.controller"
);

router.post("/", createOrder);

router.get("/", getOrders);

router.get(
    "/customer/:customerId",
    getOrdersByCustomer
);

router.get("/dashboard", getDashboardSummary);

router.get("/pending", getPendingOrders);

router.get(
    "/today-delivery",
    getTodayDeliveries
);

router.get(
    "/overdue",
    getOverdueOrders
);

router.get("/:id", getOrderById);

router.put("/:id", updateOrder);

router.patch(
    "/:id/status",
    updateOrderStatus
);

router.delete("/:id", deleteOrder);

module.exports = router;