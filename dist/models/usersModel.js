"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
    legalTerms: { type: Boolean, default: false },
    legalLandlord: { type: Boolean, default: false },
}, { collection: "users", timestamps: true });
module.exports = mongoose_1.default.model("users", userSchema);
