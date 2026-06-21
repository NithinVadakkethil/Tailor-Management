const Measurement = require('../models/Measurement');
const Customer = require('../models/Customer');
const generateMeasurementCode = require('../utils/generateMeasurementCode');

// =====================================
// CREATE MEASUREMENT
// =====================================

exports.createMeasurement = async (req, res) => {
    try {
        const {
            customerId,
            dressType,
            customDressName,
            measurements,
            notes,
        } = req.body;

        const customer =
            await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found',
            });
        }

        await Measurement.updateMany(
            {
                customerId,
                isLatest: true,
            },
            {
                isLatest: false,
            }
        );

        const measurementCode =
            await generateMeasurementCode();

        const measurement =
            await Measurement.create({
                customerId,
                measurementCode,
                dressType,
                customDressName,
                measurements,
                notes,
                isLatest: true,
            });

        res.status(201).json({
            success: true,
            message:
                'Measurement created successfully',
            data: measurement,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// =====================================
// GET LATEST MEASUREMENT
// =====================================

exports.getLatestMeasurement = async (
    req,
    res
) => {
    try {
        const { customerId } = req.params;

        const measurement =
            await Measurement.findOne({
                customerId,
                isLatest: true,
            }).populate(
                'customerId',
                'customerCode name phone'
            );

        if (!measurement) {
            return res.status(404).json({
                success: false,
                message: 'Measurement not found',
            });
        }

        res.status(200).json({
            success: true,
            data: measurement,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// =====================================
// GET MEASUREMENT HISTORY
// =====================================

exports.getMeasurementHistory =
    async (req, res) => {
        try {
            const { customerId } = req.params;

            const measurements =
                await Measurement.find({
                    customerId,
                })
                    .sort({
                        createdAt: -1,
                    })
                    .populate(
                        'customerId',
                        'customerCode name'
                    );

            res.status(200).json({
                success: true,
                count: measurements.length,
                data: measurements,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

// =====================================
// GET MEASUREMENT BY ID
// =====================================

exports.getMeasurementById =
    async (req, res) => {
        try {
            const measurement =
                await Measurement.findById(
                    req.params.id
                ).populate(
                    'customerId',
                    'customerCode name phone'
                );

            if (!measurement) {
                return res.status(404).json({
                    success: false,
                    message: 'Measurement not found',
                });
            }

            res.status(200).json({
                success: true,
                data: measurement,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

// =====================================
// GET LATEST MEASUREMENT BY DRESS TYPE
// =====================================

exports.getLatestMeasurementByDressType =
    async (req, res) => {
        try {
            const {
                customerId,
                dressType,
            } = req.params;

            const measurement =
                await Measurement.findOne({
                    customerId,
                    dressType,
                    isLatest: true,
                }).populate(
                    'customerId',
                    'customerCode name phone'
                );

            if (!measurement) {
                return res.status(404).json({
                    success: false,
                    message:
                        'Measurement not found',
                });
            }

            res.status(200).json({
                success: true,
                data: measurement,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

// =====================================
// GET MEASUREMENTS BY DRESS TYPE
// =====================================

exports.getMeasurementsByDressType =
    async (req, res) => {
        try {
            const {
                customerId,
                dressType,
            } = req.params;

            const measurements =
                await Measurement.find({
                    customerId,
                    dressType,
                })
                    .sort({
                        createdAt: -1,
                    })
                    .populate(
                        'customerId',
                        'customerCode name phone'
                    );

            res.status(200).json({
                success: true,
                count: measurements.length,
                data: measurements,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

// =====================================
// UPDATE MEASUREMENT
// =====================================

exports.updateMeasurement =
    async (req, res) => {
        try {
            const measurement =
                await Measurement.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    {
                        new: true,
                        runValidators: true,
                    }
                );

            if (!measurement) {
                return res.status(404).json({
                    success: false,
                    message: 'Measurement not found',
                });
            }

            res.status(200).json({
                success: true,
                message:
                    'Measurement updated successfully',
                data: measurement,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };

// =====================================
// DELETE MEASUREMENT
// =====================================

exports.deleteMeasurement =
    async (req, res) => {
        try {
            const measurement =
                await Measurement.findByIdAndDelete(
                    req.params.id
                );

            if (!measurement) {
                return res.status(404).json({
                    success: false,
                    message: 'Measurement not found',
                });
            }

            res.status(200).json({
                success: true,
                message:
                    'Measurement deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    };