const express = require("express");
const router = express.Router();
const {createOrder,verify}=require("../controllers/payments")
router.post("/payment/create/order",createOrder);
router.post("/payment/verify",verify);
module.exports=router;