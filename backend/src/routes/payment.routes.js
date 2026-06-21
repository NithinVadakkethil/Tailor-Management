const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth.middleware");

const paymentController = require(
    "../controllers/payment.controller"
);

router.use(auth);

// Dashboard Routes
router.get(
    "/dashboard",
    paymentController.getRevenueDashboard
);

router.get(
    "/today-revenue",
    paymentController.getTodayRevenue
);

router.get(
    "/monthly-revenue",
    paymentController.getMonthlyRevenue
);

// Customer / Order Routes
router.get(
    "/order/:orderId",
    paymentController.getPaymentsByOrder
);

router.get(
    "/customer/:customerId",
    paymentController.getPaymentsByCustomer
);

// CRUD Routes
router.post(
    "/",
    paymentController.createPayment
);

router.get(
    "/",
    paymentController.getPayments
);

router.get(
    "/:id",
    paymentController.getPaymentById
);

router.delete(
    "/:id",
    paymentController.deletePayment
);

module.exports = router;