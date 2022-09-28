"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const propertySchema = new mongoose_1.default.Schema({
    address: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    rent: { type: Number, required: true },
    deposit: { type: Number, required: true },
    availableDate: { type: Date, require: true },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "users" },
    orignalImages: [{ image: String }],
    thumbnailImages: [{ image: String }],
    description: { type: String },
    leaseTerms: Number,
    squareFeet: Number,
    amenities: [],
    propertyStatus: {
        type: String,
        enum: ["Drop", "Review", "List", "Unlisted"],
        default: "Drop",
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
}, { collection: "property", timestamps: true });
module.exports = mongoose_1.default.model("property", propertySchema);
