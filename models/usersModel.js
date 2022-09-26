const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
    role: {
      type: String,
      enum: ["Admin", "User", "Manager"],
      default: "User",
    },
    confirmationCode: { type: String, default: "" },
    isVerify: {
      type: Boolean,
      default: false
    },
  },
  { collection: "users",timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
