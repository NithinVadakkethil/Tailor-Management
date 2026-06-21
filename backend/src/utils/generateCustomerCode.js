const Counter = require("../models/Counter");

const generateCustomerCode = async () => {
    const counter =
        await Counter.findOneAndUpdate(
            {
                name: "customer",
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

    console.log("Counter:", counter);

    return `CUS${String(
        counter.sequence
    ).padStart(4, "0")}`;
};

module.exports =
    generateCustomerCode;