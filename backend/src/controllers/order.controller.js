const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Measurement = require("../models/Measurement");
const generateOrderCode = require("../utils/generateOrderCode");

// =====================================
// Create Order
// =====================================

exports.createOrder = async (req, res) => {
    try {
        const {
            customerId,
            measurementId,
            dressType,
            customDressName,
            referenceImages,
            materials = [],
            deliveryDate,
            stitchingCharge,
            paidAmount = 0,
            notes,
        } = req.body;

        const customer =
            await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        const measurement =
            await Measurement.findById(
                measurementId
            );

        if (!measurement) {
            return res.status(404).json({
                success: false,
                message: "Measurement not found",
            });
        }

        if (
            measurement.customerId.toString() !==
            customerId
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Measurement does not belong to customer",
            });
        }

        const orderCode =
            await generateOrderCode();

        const materialCost =
            materials
                .filter(
                    material =>
                        material.providedBy ===
                        "Shop"
                )
                .reduce(
                    (total, material) =>
                        total +
                        (material.cost || 0),
                    0
                );

        const totalAmount =
            stitchingCharge +
            materialCost;

        const balanceAmount =
            totalAmount - paidAmount;

        const order =
            await Order.create({
                orderCode,
                customerId,
                measurementId,
                dressType,
                customDressName,
                referenceImages,
                materials,

                stitchingCharge,
                materialCost,
                totalAmount,

                paidAmount,
                balanceAmount,

                deliveryDate,
                notes,
            });

        res.status(201).json({
            success: true,
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// =====================================
// GET ALL ORDERS
// =====================================

exports.getOrders = async (req, res) => {
    try {
        const orders =
            await Order.find()
                .populate(
                    "customerId",
                    "customerCode name phone"
                )
                .populate(
                    "measurementId",
                    "measurementCode dressType"
                )
                .sort({
                    createdAt: -1,
                });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// =====================================
// GET ORDER BY ID
// =====================================

exports.getOrderById = async (
    req,
    res
) => {
    try {
        const order =
            await Order.findById(
                req.params.id
            )
                .populate(
                    "customerId",
                    "customerCode name phone"
                )
                .populate("measurementId");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// =====================================
// GET ORDERS BY CUSTOMER
// =====================================

exports.getOrdersByCustomer =
    async (req, res) => {
        try {
            const orders =
                await Order.find({
                    customerId:
                        req.params.customerId,
                }).sort({
                    createdAt: -1,
                });

            res.status(200).json({
                success: true,
                count: orders.length,
                data: orders,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };

// =====================================
// PENDING ORDERS
// =====================================

exports.getPendingOrders =
    async (req, res) => {
        try {
            const orders =
                await Order.find({
                    status: {
                        $in: [
                            "Pending",
                            "Cutting",
                            "Stitching",
                            "Trial",
                        ],
                    },
                })
                    .populate(
                        "customerId",
                        "customerCode name phone"
                    )
                    .sort({
                        deliveryDate: 1,
                    });

            res.status(200).json({
                success: true,
                count: orders.length,
                data: orders,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

// =====================================
// TODAY DELIVERIES
// =====================================

exports.getTodayDeliveries =
    async (req, res) => {
        try {
            const startOfDay =
                new Date();

            startOfDay.setHours(
                0,
                0,
                0,
                0
            );

            const endOfDay =
                new Date();

            endOfDay.setHours(
                23,
                59,
                59,
                999
            );

            const orders =
                await Order.find({
                    deliveryDate: {
                        $gte:
                            startOfDay,
                        $lte:
                            endOfDay,
                    },

                    status: {
                        $ne:
                            "Delivered",
                    },
                })
                    .populate(
                        "customerId",
                        "customerCode name phone"
                    )
                    .sort({
                        deliveryDate: 1,
                    });

            res.status(200).json({
                success: true,
                count: orders.length,
                data: orders,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

// =====================================
// OVERDUE ORDERS
// =====================================

exports.getOverdueOrders =
    async (req, res) => {
        try {
            const today =
                new Date();

            const orders =
                await Order.find({
                    deliveryDate: {
                        $lt: today,
                    },

                    status: {
                        $nin: [
                            "Delivered",
                            "Cancelled",
                        ],
                    },
                })
                    .populate(
                        "customerId",
                        "customerCode name phone"
                    )
                    .sort({
                        deliveryDate: 1,
                    });

            res.status(200).json({
                success: true,
                count: orders.length,
                data: orders,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

// =====================================
// DASHBOARD SUMMARY
// =====================================

exports.getDashboardSummary =
    async (req, res) => {
        try {
            const today =
                new Date();

            const startOfDay =
                new Date();

            startOfDay.setHours(
                0,
                0,
                0,
                0
            );

            const endOfDay =
                new Date();

            endOfDay.setHours(
                23,
                59,
                59,
                999
            );

            const totalOrders =
                await Order.countDocuments();

            const pendingOrders =
                await Order.countDocuments({
                    status: {
                        $in: [
                            "Pending",
                            "Cutting",
                            "Stitching",
                            "Trial",
                        ],
                    },
                });

            const todayDeliveries =
                await Order.countDocuments({
                    deliveryDate: {
                        $gte:
                            startOfDay,
                        $lte:
                            endOfDay,
                    },

                    status: {
                        $ne:
                            "Delivered",
                    },
                });

            const overdueOrders =
                await Order.countDocuments({
                    deliveryDate: {
                        $lt: today,
                    },

                    status: {
                        $nin: [
                            "Delivered",
                            "Cancelled",
                        ],
                    },
                });

            res.status(200).json({
                success: true,
                summary: {
                    totalOrders,
                    pendingOrders,
                    todayDeliveries,
                    overdueOrders,
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

// =====================================
// UPDATE ORDER
// =====================================

exports.updateOrder = async (
    req,
    res
) => {
    try {
        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {
            return res.status(404).json({
                success: false,
                message:
                    "Order not found",
            });
        }

        Object.assign(
            order,
            req.body
        );

        const materialCost =
            (order.materials || [])
                .filter(
                    material =>
                        material.providedBy ===
                        "Shop"
                )
                .reduce(
                    (total, material) =>
                        total +
                        (material.cost || 0),
                    0
                );

        order.materialCost =
            materialCost;

        order.totalAmount =
            order.stitchingCharge +
            materialCost;

        order.balanceAmount =
            order.totalAmount -
            (order.paidAmount || 0);

        await order.save();

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error.message,
        });
    }
};

// =====================================
// UPDATE ORDER STATUS
// =====================================

exports.updateOrderStatus =
    async (req, res) => {
        try {
            const { status } =
                req.body;

            const order =
                await Order.findById(
                    req.params.id
                );

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Order not found",
                });
            }

            order.status = status;

            await order.save();

            res.status(200).json({
                success: true,
                data: order,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message:
                    error.message,
            });
        }
    };

// =====================================
// DELETE ORDER
// =====================================

exports.deleteOrder = async (
    req,
    res
) => {
    try {
        const order =
            await Order.findByIdAndDelete(
                req.params.id
            );

        if (!order) {
            return res.status(404).json({
                success: false,
                message:
                    "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Order deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error.message,
        });
    }
};