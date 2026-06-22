const request = require("supertest");
const app = require("../src/app");

describe("Auth API", () => {

    test("Login should return token", async () => {

        const response =
            await request(app)
                .post("/api/auth/login")
                .send({
                    email:
                        process.env.TEST_EMAIL,
                    password:
                        process.env.TEST_PASSWORD,
                });

        expect(response.statusCode)
            .toBe(200);

        expect(response.body.token)
            .toBeDefined();

    });

});