require("dotenv").config();
const chalk = require("chalk");

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        console.log(chalk.rgb(255, 165, 0)("🚀 Starting Tailor Management API..."));
        console.log(chalk.rgb(255, 165, 0)("📦 Connecting to MongoDB..."));

        await connectDB();

        app.listen(PORT, () => {
            console.log(chalk.bgBlueBright("                                                  "));
            console.log(chalk.greenBright(`🌍 Environment : ${process.env.NODE_ENV || "development"}`));
            console.log(chalk.greenBright(`🚀 Server      : http://localhost:${PORT}`));
            console.log(chalk.greenBright("✅ Backend Ready"));
            console.log(chalk.bgBlueBright("                                                  "));
        });
    } catch (error) {
        console.error(chalk.red("❌ Server startup failed"));
        console.error(chalk.red(error));
        process.exit(1);
    }
};

startServer();