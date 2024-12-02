const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Storing plain password (not recommended)
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  phoneNo: { type: Number, required: true },
});

module.exports = mongoose.model("User", UserSchema);
