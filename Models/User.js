const Mongoose = require("mongoose");

const { Schema } = Mongoose;

// User Schema
const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique:true
  },

  password: {
    type: String,
  },
});

module.exports = Mongoose.model("User", UserSchema);
