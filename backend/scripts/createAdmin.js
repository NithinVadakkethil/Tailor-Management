require("dotenv").config();

const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const User = require("../src/models/User");

const run = async () => {
    await mongoose.connect(
        process.env.MONGO_URI
    );

    const hashedPassword =
        await bcrypt.hash(
            "Admin@123",
            12
        );

    await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword
    });

    console.log("Admin Created");

    process.exit();
};

run();