const mongoose = require('mongoose');

const measurementSchema =
    new mongoose.Schema(
        {
            customerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Customer',
                required: true,
            },

            measurementCode: {
                type: String,
                unique: true,
                required: true,
            },

            dressType: {
                type: String,
                enum: [
                    'Blouse',
                    'Churidar',
                    'Salwar',
                    'Kids Dress',
                    'Custom',
                ],
                required: true,
            },

            customDressName: {
                type: String,
                default: '',
            },

            measurements: [
                {
                    label: {
                        type: String,
                        required: true,
                    },

                    value: {
                        type: Number,
                        required: true,
                    },
                },
            ],

            notes: String,

            isLatest: {
                type: Boolean,
                default: true,
            },
        },
        {
            timestamps: true,
        }
    );

module.exports =
    mongoose.model(
        'Measurement',
        measurementSchema
    );