const express = require("express");
const router = express.Router();
const passengerController = require("../controllers/passengerController");

router.get("/", passengerController.home);

router.get("/fee", passengerController.fee);

router.get("/newPassenger", passengerController.newPassenger);
router.post("/newPassenger", passengerController.newPassengerPost)
router.post("/checkout", passengerController.checkout);

router.get("/checkout", passengerController.checkout_get);

router.post("/payment", passengerController.payment);

router.post("/getPrice",passengerController.getPrice);
router.post("/seats", passengerController.seats);
router.get("/success",passengerController.success);
module.exports = router;
