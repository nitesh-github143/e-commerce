require("dotenv").config();
const express = require("express");
const router = express.Router();

const payment = require("../controller/payment");

router
  .post("/checkout", payment.checkout)
  .post("/paymentverification", payment.paymentVerification)
  .get("/getkey", payment.getKey);

exports.router = router;
