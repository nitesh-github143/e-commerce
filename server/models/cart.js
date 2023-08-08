const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const cartSchema = new Schema({
  productId: {
    type: ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  userId: {
    type: ObjectId,
    ref: "User",
  },
});

exports.CartItem = mongoose.model("CartItem", cartSchema);
