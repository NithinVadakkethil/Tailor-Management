const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

const authRoutes = require("./routes/auth.routes");
const customerRoutes = require("./routes/customer.routes");
const measurementRoutes = require(
    "./routes/measurement.routes"
);
const orderRoutes = require(
    "./routes/order.routes"
);
const paymentRoutes = require(
    "./routes/payment.routes"
);

const errorHandler = require(
    "./middleware/error.middleware"
);

const app = express();

// =============================
// TRUST PROXY
// =============================

app.set("trust proxy", 1);

// =============================
// SECURITY
// =============================

app.use(helmet());

app.use(compression());

// =============================
// CORS
// =============================

app.use(cors());

// =============================
// BODY PARSER
// =============================

app.use(
    express.json({
        limit: "10mb",
    })
);

app.use(express.urlencoded({
    extended: true,
}));

// =============================
// LOGGING
// =============================

if (
    process.env.NODE_ENV ===
    "development"
) {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

// =============================
// ROUTES
// =============================

app.use("/api/auth", authRoutes);

app.use(
    "/api/customers",
    customerRoutes
);

app.use(
    "/api/measurements",
    measurementRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

app.use(
    "/api/payments",
    paymentRoutes
);

// =============================
// ROOT
// =============================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message:
            "Tailor Management API Running",
    });
});

// =============================
// HEALTH CHECK
// =============================

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server Healthy",
        timestamp: new Date(),
    });
});

// =============================
// VERSION
// =============================

app.get("/api/version", (req, res) => {
    res.status(200).json({
        success: true,
        version: "1.0.0",
        environment: process.env.NODE_ENV,
    });
});

// =============================
// 404 HANDLER
// =============================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// =============================
// GLOBAL ERROR HANDLER
// =============================

app.use(errorHandler);

module.exports = app;