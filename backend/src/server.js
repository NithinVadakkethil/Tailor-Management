if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

require("./config/env");

const chalk = require("chalk");

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        console.log(
            chalk.rgb(255, 165, 0)(
                "🚀 Starting Tailor Management API..."
            )
        );

        console.log(
            chalk.rgb(255, 165, 0)(
                "📦 Connecting to MongoDB..."
            )
        );

        await connectDB();

        app.listen(PORT, () => {
            console.log(
                chalk.bgBlueBright(
                    "                                                  "
                )
            );

            console.log(
                chalk.greenBright(
                    `🌍 Environment : ${process.env.NODE_ENV ||
                    "development"
                    }`
                )
            );

            if (
                process.env.NODE_ENV ===
                "production"
            ) {
                console.log(
                    chalk.greenBright(
                        "🚀 Running in Production"
                    )
                );
            } else {
                console.log(
                    chalk.greenBright(
                        `🚀 Server : http://localhost:${PORT}`
                    )
                );
            }

            console.log(
                chalk.greenBright(
                    "✅ Backend Ready"
                )
            );

            console.log(
                chalk.bgBlueBright(
                    "                                                  "
                )
            );
        });
    } catch (error) {
        console.error(
            chalk.red(
                "❌ Server startup failed"
            )
        );

        console.error(error);

        process.exit(1);
    }
};

startServer();

// =============================
// HANDLE UNCAUGHT ERRORS
// =============================

process.on(
    "unhandledRejection",
    (err) => {
        console.error(
            chalk.red(
                "❌ Unhandled Rejection"
            )
        );

        console.error(err);

        process.exit(1);
    }
);

process.on(
    "uncaughtException",
    (err) => {
        console.error(
            chalk.red(
                "❌ Uncaught Exception"
            )
        );

        console.error(err);

        process.exit(1);
    }
);