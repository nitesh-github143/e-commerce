const cartModel = require("../models/cart");
const productModel = require("../models/product");

const CartItem = cartModel.CartItem;
const Product = productModel.Product;

exports.addToCart = (req, res) => {
  const { productId, quantity, userId } = req.body;
  // Find the product by its ID
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      CartItem.findOne({ productId, userId })
        .then((cartItem) => {
          if (cartItem) {
            cartItem.quantity += quantity;
          } else {
            cartItem = new CartItem({
              productId,
              quantity,
              userId,
            });
          }
          cartItem
            .save()
            .then((savedCartItem) => {
              res.status(201).json({ message: "Item added successfully" });
            })
            .catch((error) => {
              res
                .status(500)
                .json({ error: "Error saving cart item to the database" });
            });
        })
        .catch((error) => {
          res
            .status(500)
            .json({ error: "Error finding cart item in the database" });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: "Error finding product in the database" });
    });
};

exports.cartItemById = (req, res) => {
  CartItem.find({ userId: req.params.id })
    .populate("productId")
    .then((cartItems) => {
      res.json(cartItems);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "Error fetching cart items from the database" });
    });
};

exports.deleteCartItemById = (req, res) => {
  const userId = req.user.id;
  CartItem.findById(req.params.id)
    .then((foundItem) => {
      if (!foundItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      foundItem
        .deleteOne()
        .then(() => {
          CartItem.find({ userId })
            .populate("productId")
            .then((remainingItems) => {
              res.status(200).json({
                message: "Item deleted successfully",
                remainingItems,
              });
            })
            .catch((error) => {
              console.error(error);
              res
                .status(500)
                .json({ message: "Failed to fetch remaining items" });
            });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: "Failed to delete item" });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
};

exports.updateCartItem = (req, res) => {
  const { quantity } = req.body;
  CartItem.findById(req.params.id)
    .then((foundItem) => {
      if (!foundItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      foundItem.quantity = quantity;
      foundItem
        .save()
        .then(() => {
          CartItem.find()
            .populate("productId")
            .then((updatedItems) => {
              res.status(200).json({
                message: "Item quantity updated successfully",
                updatedItems,
              });
            })
            .catch((error) => {
              console.error(error);
              res
                .status(500)
                .json({ message: "Failed to fetch updated items" });
            });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: "Failed to update item quantity" });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    });
};
