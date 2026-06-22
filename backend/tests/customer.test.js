const request = require("supertest");
const app = require("../src/app");

const getAuthToken =
    require("./helpers/login");

describe("Customer API", () => {

    test("Create Customer", async () => {

        const token =
            await getAuthToken();

        const response =
            await request(app)
                .post("/api/customers")
                .set(
                    "Authorization",
                    `Bearer ${token}`
                )
                .send({
                    name: "Jest User",
                    phone:
                        Date.now().toString(),
                });

        expect(response.statusCode)
            .toBe(201);

        expect(response.body.success)
            .toBe(true);

    });

    // test("Get Customers", async () => {

    // });

    // test("Get Customer By Id", async () => {

    // });

    // test("Update Customer", async () => {

    // });

    // test("Delete Customer", async () => {

    // });

});