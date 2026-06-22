const Customer = require("../models/Customer");
const generateCustomerCode = require("../utils/generateCustomerCode");

exports.createCustomer = async (req, res) => {
    try {
        const customerCode =
            await generateCustomerCode();

        console.log("Generated Customer Code:", customerCode);

        const customer = await Customer.create({
            ...req.body,
            customerCode,
        });

        res.status(201).json({
            success: true,
            data: customer,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getCustomers =
    async (req, res) => {

        const page =
            Number(req.query.page) || 1;

        const limit =
            Number(req.query.limit) || 10;

        const skip =
            (page - 1) * limit;

        const search =
            req.query.search || "";

        const filter = {
            isActive: true
        };

        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    phone: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    customerCode: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        const customers =
            await Customer.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({
                    createdAt: -1
                });

        const total =
            await Customer.countDocuments(
                filter
            );

        res.json({
            success: true,

            total,

            page,

            limit,

            data: customers
        });
    };

exports.getCustomerById =
    async (req, res) => {

        const customer =
            await Customer.findById(
                req.params.id
            );

        if (!customer) {
            return res
                .status(404)
                .json({
                    message:
                        "Customer not found"
                });
        }

        res.json({
            success: true,
            data: customer
        });
    };

exports.updateCustomer =
    async (req, res) => {

        const customer =
            await Customer.findByIdAndUpdate(
                req.params.id,

                req.body,

                {
                    returnDocument: "after"
                }
            );

        res.json({
            success: true,
            data: customer
        });
    };

exports.deleteCustomer =
    async (req, res) => {

        const customer =
            await Customer.findByIdAndUpdate(
                req.params.id,

                {
                    isActive: false
                },

                {
                    returnDocument: "after"
                }
            );

        res.json({
            success: true,
            message:
                "Customer deleted"
        });
    };