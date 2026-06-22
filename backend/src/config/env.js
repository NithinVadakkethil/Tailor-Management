const requiredVars = [
    "MONGO_URI",
    "JWT_SECRET",
];

requiredVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(
            `${key} is missing`
        );
    }
});