const Counter = require("../models/Counter");

const generateOrderCode = async () => {
    const counter =
        await Counter.findOneAndUpdate(
            {
                name: "order",
            },
            {
                $inc: {
                    sequence: 1,
                },
            },
            {
                returnDocument: "after",
                upsert: true,
            }
        );

    return `ORD${String(
        counter.sequence
    ).padStart(5, "0")}`;
};

module.exports = generateOrderCode;