const mongoose = require("mongoose");
const chalk = require("chalk");

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }

        await mongoose.connect(
            process.env.MONGO_URI
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
        process.exit(1);
    }
};

module.exports = connectDB;