const { z } = require('zod');

exports.createMeasurementSchema =
    z.object({
        customerId: z.string(),

        bust: z.number().optional(),

        waist: z.number().optional(),

        hip: z.number().optional(),

        shoulder: z.number().optional(),

        sleeveLength:
            z.number().optional(),

        notes:
            z.string().optional(),
    });