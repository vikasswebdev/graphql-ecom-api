const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const validator = require("validator");
const slug = require("../util/Slug");
const Product = require("../models/product");
const role = require("../middleware/role");
const dotenv = require("dotenv").config();

module.exports = {
  // Create a new user and save it to the database
  createUser: async ({ userInput }, req) => {
    const errors = [];
    if (!validator.default.isEmail(userInput.email)) {
      errors.push({ message: "Invalid Email." });
    }

    if (
      validator.default.isEmpty(userInput.password) ||
      !validator.default.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password too short!" });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid Input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email: userInput.email });

    if (existingUser) {
      const error = new Error("User exists already!");
      throw error;
    }

    const hashPass = await bcrypt.hash(userInput.password, 12);

    const user = new User({
      email: userInput.email,
      password: hashPass,
      name: userInput.name,
    });

    const createdUser = await user.save();

    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },

  // Login a user and return a token if the credentials are correct
  login: async ({ email, password }, req) => {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User not found.");
      error.code = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Password is incorrect.");
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "iamvikaspatel",
      { expiresIn: "1h" }
    );
    return {
      token: token,
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },

  // create a new product and save it to the database

  createProduct: async ({ productInput }, req) => {
    if (!req.isAuth) {
      const error = new Error("Not authenticated!");
      error.code = 401;
      throw error;
    }

    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found.");
      error.code = 401;
      throw error;
    }

    if (user.role !== role.ROLES.Admin) {
      const error = new Error("Only admins can create products.");
      error.code = 401;
      throw error;
    }

    const errors = [];
    if (
      validator.default.isEmpty(productInput.name) ||
      !validator.default.isLength(productInput.name, { min: 5 })
    ) {
      errors.push({ message: "Name is too short!" });
    }

    // if (!validator.default.isFloat(productInput.price)) {
    //   errors.push({ message: "Price is not a number!" });
    // }

    if (
      validator.default.isEmpty(productInput.description) ||
      !validator.default.isLength(productInput.description, { min: 10 })
    ) {
      errors.push({ message: "Description is too short!" });
    }

    // if (
    //   validator.default.isEmpty(productInput.quantity) ||
    //   !validator.default.isInt(productInput.quantity)
    // ) {
    //   errors.push({ message: "Quantity is not a number!" });
    // }

    // console.log(productInput);

    if (errors.length > 0) {
      const error = new Error("Invalid Input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const myslug = slug(productInput.name);

    const existingProduct = await Product.findOne({ slug: myslug });

    if (existingProduct) {
      const error = new Error("Product exists already!");
      throw error;
    }

    const product = new Product({
      user: req.userId,
      name: productInput.name,
      slug: myslug,
      imageUrl: productInput.imageUrl,
      price: productInput.price,
      description: productInput.description,
      quantity: productInput.quantity,
      taxable: productInput.taxable,
      isActive: productInput.isActive,
    });

    const createdProduct = await product.save();
    return { ...createdProduct._doc, _id: createdProduct._id.toString() };
  },

  // get all products from the database
  products: async ({ page, limit }) => {
    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 8;
    }

    const totalProducts = await Product.find().countDocuments();

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(limit * (page - 1))
      .limit(limit);

    return {
      products: products.map((product) => {
        return {
          ...product._doc,
          _id: product._id.toString(),
          created: product.created.toISOString(),
          updated: product.updated.toISOString(),
        };
      }),

      total: totalProducts,
    };
  },
};
