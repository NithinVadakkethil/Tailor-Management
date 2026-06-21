const express =
    require("express");

const router =
    express.Router();

const auth =
    require("../middleware/auth.middleware");

const validate =
    require("../middleware/validate.middleware");

const {
    createCustomerSchema
} =
    require("../validators/customer.validator");

const customerController =
    require("../controllers/customer.controller");

router.use(auth);

router.post(
    "/",
    validate(
        createCustomerSchema
    ),
    customerController.createCustomer
);

router.get(
    "/",
    customerController.getCustomers
);

router.get(
    "/:id",
    customerController.getCustomerById
);

router.put(
    "/:id",
    customerController.updateCustomer
);

router.delete(
    "/:id",
    customerController.deleteCustomer
);

module.exports = router;