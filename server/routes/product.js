const express = require("express");
const router = express.Router();
const { isLogin } = require("../middleware/isLogin");
const product = require("../controller/product");

router
  .get("/allproducts", product.getAllProduct)
  .get("/product/:id", product.getProductById);

exports.router = router;
