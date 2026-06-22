// tests/payment.test.js
const request = require("supertest");

const app = require("../src/app");

const getToken =
    require("./helpers/login");

describe(
    "Payment API",
    () => {
        test(
            "Create Payment",
            async () => {

                const token =
                    await getToken();

                // =====================
                // Create Customer
                // =====================

                const customerResponse =
                    await request(app)
                        .post("/api/customers")
                        .set(
                            "Authorization",
                            `Bearer ${token}`
                        )
                        .send({
                            name:
                                "Payment Test Customer",
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

                // =====================
                // Create Measurement
                // =====================

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
                                "Payment Test Measurement",
                        });

                expect(
                    measurementResponse.statusCode
                ).toBe(201);

                const measurementId =
                    measurementResponse
                        .body
                        .data
                        ._id;

                // =====================
                // Create Order
                // =====================

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
                                1000,

                            paidAmount:
                                0,

                            deliveryDate:
                                "2026-07-01",

                            notes:
                                "Payment Test Order",
                        });

                expect(
                    orderResponse.statusCode
                ).toBe(201);

                const orderId =
                    orderResponse
                        .body
                        .data
                        ._id;

                // =====================
                // Create Payment
                // =====================

                const paymentResponse =
                    await request(app)
                        .post("/api/payments")
                        .set(
                            "Authorization",
                            `Bearer ${token}`
                        )
                        .send({
                            orderId,

                            amount: 300,

                            paymentMethod:
                                "Cash",

                            paymentType:
                                "Advance",

                            notes:
                                "Jest Payment",
                        });

                expect(
                    paymentResponse.statusCode
                ).toBe(201);

                expect(
                    paymentResponse
                        .body
                        .success
                ).toBe(true);

                expect(
                    paymentResponse
                        .body
                        .data
                        .paymentCode
                ).toBeDefined();

                expect(
                    paymentResponse
                        .body
                        .data
                        .amount
                ).toBe(300);

                expect(
                    paymentResponse
                        .body
                        .data
                        .paymentMethod
                ).toBe("Cash");

                expect(
                    paymentResponse
                        .body
                        .data
                        .paymentType
                ).toBe("Advance");

                // =====================
                // Verify Order Updated
                // =====================

                const updatedOrder =
                    await request(app)
                        .get(
                            `/api/orders/${orderId}`
                        )
                        .set(
                            "Authorization",
                            `Bearer ${token}`
                        );

                expect(
                    updatedOrder
                        .body
                        .data
                        .paidAmount
                ).toBe(300);

                expect(
                    updatedOrder
                        .body
                        .data
                        .balanceAmount
                ).toBe(700);
            }
        );
    }
);