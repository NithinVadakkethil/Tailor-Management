const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        customerCode: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            unique: true
        },

        address: {
            type: String,
            default: ""
        },

        notes: {
            type: String,
            default: ""
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

customerSchema.index({
    name: "text",
    phone: "text"
});

module.exports = mongoose.model(
    "Customer",
    customerSchema
);