const Counter =
    require('../models/Counter');

const generateMeasurementCode =
    async () => {
        const counter =
            await Counter.findOneAndUpdate(
                {
                    name: 'measurement',
                },
                {
                    $inc: {
                        sequence: 1,
                    },
                },
                {
                    new: true,
                    upsert: true,
                }
            );

        return `MSR-${new Date().getFullYear()}-${String(
            counter.sequence
        ).padStart(4, '0')}`;
    };

module.exports =
    generateMeasurementCode;