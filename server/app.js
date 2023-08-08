require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Razorpay = require("razorpay");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const DATABASE = process.env.DATABASE;
const PORT = process.env.PORT || 4000;

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

exports.instance = instance;

// connection with Database
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(DATABASE);
  console.log("DB connected");
}

const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const paymentRouter = require("./routes/payment");

app.use("/", authRouter.router);
app.use("/", productRouter.router);
app.use("/", cartRouter.router);
app.use("/", paymentRouter.router);

app.listen(PORT, () => {
  console.log("Server created!");
});
