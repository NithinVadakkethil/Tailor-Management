const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const generatePaymentCode = require(
    "../utils/generatePaymentCode"
);

exports.createPayment = async (
    req,
    res
) => {
    try {
        const {
            orderId,
            amount,
            paymentMethod,
            paymentType,
            notes,
        } = req.body;

        const order =
            await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const paymentCode =
            await generatePaymentCode();

        const payment =
            await Payment.create({
                paymentCode,
                orderId,
                customerId:
                    order.customerId,
                amount,
                paymentMethod,
                paymentType,
                notes,
            });

        order.paidAmount =
            (order.paidAmount || 0) +
            amount;

        order.balanceAmount =
            order.totalAmount -
            order.paidAmount;

        await order.save();

        res.status(201).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error.message,
        });
    }
};

exports.getPayments = async (
    req,
    res
) => {
    try {
        const payments =
            await Payment.find()
                .populate(
                    "customerId",
                    "customerCode name phone"
                )
                .populate(
                    "orderId",
                    "orderCode"
                )
                .sort({
                    createdAt: -1,
                });

        res.status(200).json({
            success: true,
            count:
                payments.length,
            data: payments,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error.message,
        });
    }
};

exports.getPaymentById = async (
    req,
    res
) => {
    try {
        const payment =
            await Payment.findById(
                req.params.id
            )
                .populate(
                    "customerId",
                    "customerCode name phone"
                )
                .populate(
                    "orderId",
                    "orderCode"
                );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message:
                    "Payment not found",
            });
        }

        res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error.message,
        });
    }
};

exports.getPaymentsByOrder =
    async (req, res) => {
        try {
            const payments =
                await Payment.find({
                    orderId:
                        req.params.orderId,
                }).sort({
                    createdAt: -1,
                });

            res.status(200).json({
                success: true,
                count:
                    payments.length,
                data: payments,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };

exports.getPaymentsByCustomer =
    async (req, res) => {
        try {
            const payments =
                await Payment.find({
                    customerId:
                        req.params.customerId,
                }).sort({
                    createdAt: -1,
                });

            res.status(200).json({
                success: true,
                count:
                    payments.length,
                data: payments,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };

exports.deletePayment = async (
    req,
    res
) => {
    try {
        const payment =
            await Payment.findById(
                req.params.id
            );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message:
                    "Payment not found",
            });
        }

        const order =
            await Order.findById(
                payment.orderId
            );

        if (order) {
            order.paidAmount -=
                payment.amount;

            order.balanceAmount =
                order.totalAmount -
                order.paidAmount;

            await order.save();
        }

        await payment.deleteOne();

        res.status(200).json({
            success: true,
            message:
                "Payment deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error.message,
        });
    }
};

exports.getTodayRevenue =
    async (req, res) => {
        try {
            const start =
                new Date();

            start.setHours(
                0,
                0,
                0,
                0
            );

            const end =
                new Date();

            end.setHours(
                23,
                59,
                59,
                999
            );

            const result =
                await Payment.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte:
                                    start,
                                $lte:
                                    end,
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: "$amount",
                            },
                        },
                    },
                ]);

            res.status(200).json({
                success: true,
                totalRevenue:
                    result[0]?.total ||
                    0,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };

exports.getMonthlyRevenue =
    async (req, res) => {
        try {
            const today =
                new Date();

            const start =
                new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    1
                );

            const result =
                await Payment.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte:
                                    start,
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: "$amount",
                            },
                        },
                    },
                ]);

            res.status(200).json({
                success: true,
                totalRevenue:
                    result[0]?.total ||
                    0,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };

exports.getRevenueDashboard =
    async (req, res) => {
        try {
            const totalRevenue =
                await Payment.aggregate([
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: "$amount",
                            },
                        },
                    },
                ]);

            const todayRevenue =
                await Payment.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(
                                    new Date().setHours(
                                        0,
                                        0,
                                        0,
                                        0
                                    )
                                ),
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            total: {
                                $sum: "$amount",
                            },
                        },
                    },
                ]);

            res.status(200).json({
                success: true,

                summary: {
                    totalRevenue:
                        totalRevenue[0]
                            ?.total || 0,

                    todayRevenue:
                        todayRevenue[0]
                            ?.total || 0,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };