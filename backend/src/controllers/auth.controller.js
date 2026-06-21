const bcrypt = require("bcryptjs");

const User = require("../models/User");

const generateToken =
    require("../utils/generateToken");

exports.login = async (
    req,
    res
) => {
    const { email, password } =
        req.body;

    const user =
        await User.findOne({ email });

    if (!user) {
        return res
            .status(401)
            .json({
                message:
                    "Invalid credentials"
            });
    }

    const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
        });
    }

    const token =
        generateToken(user._id);

    res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
};