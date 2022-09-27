const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    moblie: { type: Number, require: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Landlord"],
      default: "Landlord",
    },
    confirmationCode: { type: String, default: "" },
    isVerified: {
      type: Boolean,
      default: false,
    },
    termsAndCondition: [
      {
        legalTerms: Boolean,
      },
      {
        legalLandlord: Boolean,
      },
    ],
  },
  { collection: "users", timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
