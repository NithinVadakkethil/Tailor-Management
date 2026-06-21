const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        orderCode: {
            type: String,
            required: true,
            unique: true,
        },

        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },

        measurementId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Measurement",
            required: true,
        },

        dressType: {
            type: String,
            required: true,
        },

        customDressName: {
            type: String,
            default: "",
        },

        referenceImages: [
            {
                imageUrl: {
                    type: String,
                },

                imageType: {
                    type: String,
                    enum: [
                        "Front Design",
                        "Back Design",
                        "Sleeve Design",
                        "Reference",
                    ],
                    default: "Reference",
                },

                notes: {
                    type: String,
                    default: "",
                },
            },
        ],

        materials: [
            {
                name: {
                    type: String,
                    required: true,
                },

                quantity: {
                    type: Number,
                    default: 1,
                },

                providedBy: {
                    type: String,
                    enum: [
                        "Customer",
                        "Shop",
                    ],
                    default: "Customer",
                },

                cost: {
                    type: Number,
                    default: 0,
                },

                notes: {
                    type: String,
                    default: "",
                },
            },
        ],

        stitchingCharge: {
            type: Number,
            required: true,
            min: 0,
        },

        materialCost: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        paidAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        balanceAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        orderDate: {
            type: Date,
            default: Date.now,
        },

        deliveryDate: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Cutting",
                "Stitching",
                "Trial",
                "Ready For Pickup",
                "Delivered",
                "Cancelled",
            ],
            default: "Pending",
        },

        notes: {
            type: String,
            default: "",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Order",
    orderSchema
);