// src/config/db.js

const mongoose = require("mongoose");
const chalk = require("chalk");

const connectDB = async (options = {}) => {
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }

        await mongoose.connect(
            process.env.MONGO_URI,
            options
        );

        console.log(
            chalk.green("✅ MongoDB Connected")
        );
    } catch (error) {
        console.log(
            chalk.red("❌ MongoDB Connection Failed")
        );

        console.log(
            chalk.red(error.message)
        );

        throw error;
    }
};

module.exports = connectDB;