const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    rentOrDeposit: { type: Number, required: true },
    availableDate: { type: Date, require: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    propertyImages: [{ propertyImage: String }],
    description: { type: String },
    leaseTerms: Number,
    squareFeet:Number,
    amenities: [{ amenitie: String }],
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
  },
  { collection: "property", timestamps: true }
);

module.exports = mongoose.model("property", propertySchema);
