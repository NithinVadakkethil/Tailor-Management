const request = require("supertest");
const app = require("../../src/app");

const getAuthToken = async () => {
    const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: process.env.TEST_EMAIL,
            password: process.env.TEST_PASSWORD,
        });

    return response.body.token;
};

module.exports = getAuthToken;