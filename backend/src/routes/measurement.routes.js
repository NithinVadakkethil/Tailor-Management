const express = require('express');

const {
    createMeasurement,
    getLatestMeasurement,
    getMeasurementHistory,
    getMeasurementById,
    getMeasurementsByDressType,
    getLatestMeasurementByDressType,
    updateMeasurement,
    deleteMeasurement,
} = require('../controllers/measurement.controller');

const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createMeasurement);

router.get(
    '/customer/:customerId',
    getLatestMeasurement
);

router.get(
    '/customer/:customerId/history',
    getMeasurementHistory
);

router.get(
    '/customer/:customerId/dress/:dressType',
    getMeasurementsByDressType
);

router.get(
    '/customer/:customerId/latest/:dressType',
    getLatestMeasurementByDressType
);

router.get('/:id', getMeasurementById);

router.put('/:id', updateMeasurement);

router.delete('/:id', deleteMeasurement);

module.exports = router;