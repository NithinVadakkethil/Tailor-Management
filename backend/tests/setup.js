const mongoose = require("mongoose");
const connectDB = require("../src/config/db");

beforeAll(async () => {
    await connectDB({
        maxPoolSize: 1,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
});