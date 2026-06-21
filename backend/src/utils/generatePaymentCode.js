const Counter = require(
    "../models/Counter"
);

const generatePaymentCode =
    async () => {
        const counter =
            await Counter.findOneAndUpdate(
                {
                    name: "payment",
                },
                {
                    $inc: {
                        sequence: 1,
                    },
                },
                {
                    returnDocument:
                        "after",
                    upsert: true,
                }
            );

        return `PAY${String(
            counter.sequence
        ).padStart(5, "0")}`;
    };

module.exports =
    generatePaymentCode;