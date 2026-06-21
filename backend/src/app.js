const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const customerRoutes = require("./routes/customer.routes");
const measurementRoutes = require('./routes/measurement.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const helmet = require("helmet");
const compression = require("compression");

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan("dev"));

app.use(helmet());
app.use(compression());

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Tailor API Running"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server Healthy",
        timestamp: new Date(),
    });
});

module.exports = app;