const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const useSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "ROLE_MEMBER",
    enum: ["ROLE_MEMBER", "ROLE_ADMIN", "ROLE_MERCHANT"],
  },
});

module.exports = Mongoose.model("User", useSchema);
