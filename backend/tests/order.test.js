const request = require("supertest");

const app = require("../src/app");

const getToken =
    require("./helpers/login");

describe(
    "Order API",
    () => {
        test(
            "Create Order",
            async () => {

                const token =
                    await getToken();

                // ======================
                // Create Customer
                // ======================

                const customerResponse =
                    await request(app)
                        .post("/api/customers")
                        .set(
                            "Authorization",
                            `Bearer ${token}`
                        )
                        .send({
                            name:
                                "Order Test Customer",
                            phone:
                                `${Date.now()}`
                        });

                expect(
                    customerResponse.statusCode
                ).toBe(201);

                const customerId =
                    customerResponse
                        .body
                        .data
                        ._id;

                // ======================
                // Create Measurement
                // ======================

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
                            ],

                            notes:
                                "Order Test Measurement",
                        });

                expect(
                    measurementResponse.statusCode
                ).toBe(201);

                const measurementId =
                    measurementResponse
                        .body
                        .data
                        ._id;

                // ======================
                // Create Order
                // ======================

                const orderResponse =
                    await request(app)
                        .post("/api/orders")
                        .set(
                            "Authorization",
                            `Bearer ${token}`
                        )
                        .send({
                            customerId,
                            measurementId,

                            dressType:
                                "Blouse",

                            stitchingCharge:
                                800,

                            paidAmount:
                                200,

                            deliveryDate:
                                "2026-07-01",

                            notes:
                                "Jest Order",
                        });

                expect(
                    orderResponse.statusCode
                ).toBe(201);

                expect(
                    orderResponse
                        .body
                        .success
                ).toBe(true);

                expect(
                    orderResponse
                        .body
                        .data
                        .orderCode
                ).toBeDefined();

                expect(
                    orderResponse
                        .body
                        .data
                        .status
                ).toBe("Pending");

                expect(
                    orderResponse
                        .body
                        .data
                        .totalAmount
                ).toBe(800);

                expect(
                    orderResponse
                        .body
                        .data
                        .paidAmount
                ).toBe(200);

                expect(
                    orderResponse
                        .body
                        .data
                        .balanceAmount
                ).toBe(600);
            }
        );
    }
);