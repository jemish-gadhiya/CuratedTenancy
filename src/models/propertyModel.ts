import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    rent: { type: Number, required: true },
    deposit:{ type: Number, required: true },
    availableDate: { type: Date, require: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    orignalImages: [{ image: String }],
    thumbnailImages: [{ image: String }],
    description: { type: String },
    leaseTerms: Number,
    squareFeet:Number,
    amenities: [],
    propertyStatus: {
      type: String,
      enum: ["Drop", "Review", "List", "Unlisted"],
      default: "Drop",
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
  },
  { collection: "property", timestamps: true }
);

module.exports = mongoose.model("property", propertySchema);
