const express = require("express");
const router = express.Router();
const cart = require("../controller/cart");
const { isLogin } = require("../middleware/isLogin");

// Route to add a product to the cart
router
  .post("/add-to-cart", isLogin, cart.addToCart)
  .get("/cart/:id", isLogin, cart.cartItemById)
  .delete("/deleteitem/:id", isLogin, cart.deleteCartItemById)
  .patch("/updateitem/:id", isLogin, cart.updateCartItem);

exports.router = router;
