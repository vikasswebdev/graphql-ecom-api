const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const productSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  taxable: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  //   brand: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Brand',
  //     default: null
  //   },
  //   category: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Category',
  //     default: null
  //   },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("Product", productSchema);
