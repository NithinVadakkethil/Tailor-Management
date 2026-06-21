const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        paymentCode: {
            type: String,
            unique: true,
            required: true,
        },

        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },

        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: [
                "Cash",
                "Google Pay",
                "PhonePe",
                "UPI",
                "Bank Transfer",
            ],
            required: true,
        },

        paymentType: {
            type: String,
            enum: [
                "Advance",
                "Partial",
                "Final",
            ],
            required: true,
        },

        notes: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports =
    mongoose.model(
        "Payment",
        paymentSchema
    );