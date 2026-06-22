const request = require("supertest");

const app = require("../src/app");

const getToken =
    require("./helpers/login");

describe(
    "Measurement API",
    () => {
        test(
            "Create Measurement",
            async () => {

                const token =
                    await getToken();

                // Create Customer First
                const customerResponse =
                    await request(app)
                        .post("/api/customers")
                        .set(
                            "Authorization",
                            `Bearer ${token}`
                        )
                        .send({
                            name: "Measurement Test Customer",
                            phone: `${Date.now()}`
                        });

                expect(
                    customerResponse.statusCode
                ).toBe(201);

                const customerId =
                    customerResponse
                        .body
                        .data
                        ._id;

                // Create Measurement
                const measurementResponse =
                    await request(app)
                        .post(
                            "/api/measurements"
                        )
                        .set(
                            "Authorization",
                            `Bearer ${token}`
                        )
                        .send({
                            customerId,

                            dressType:
                                "Blouse",

                            measurements: [
                                {
                                    label:
                                        "Bust",
                                    value: 34,
                                },
                                {
                                    label:
                                        "Waist",
                                    value: 30,
                                },
                                {
                                    label:
                                        "Front Neck",
                                    value: 7,
                                },
                            ],

                            notes:
                                "Jest Measurement",
                        });

                expect(
                    measurementResponse.statusCode
                ).toBe(201);

                expect(
                    measurementResponse
                        .body
                        .success
                ).toBe(true);

                expect(
                    measurementResponse
                        .body
                        .data
                        .measurementCode
                ).toBeDefined();

                expect(
                    measurementResponse
                        .body
                        .data
                        .customerId
                ).toBeDefined();
            }
        );
    }
);