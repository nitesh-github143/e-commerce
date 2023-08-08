require("dotenv").config();
const model = require("../models/product");
const Product = model.Product;

exports.getAllProduct = (req, res) => {
  Product.find()
    .then((products) => {
      res.json({ products });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductById = (req, res) => {
  Product.findOne({ _id: req.params.id })
    .then((product) => {
      res.json({ product });
    })
    .catch((err) => {
      console.log(err);
    });
};
