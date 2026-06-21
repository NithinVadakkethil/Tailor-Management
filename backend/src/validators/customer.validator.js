const { z } = require("zod");

exports.createCustomerSchema = z.object({
    name: z
        .string()
        .min(2)
        .max(100),

    phone: z
        .string()
        .min(10)
        .max(15),

    address: z
        .string()
        .optional(),

    notes: z
        .string()
        .optional()
});