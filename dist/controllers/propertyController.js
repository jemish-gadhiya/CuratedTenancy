"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const propertyModel = require("../models/propertyModel");
const { verifyToken } = require("./authController");
const router = express_1.default.Router();
// Add and update property service
router.post("/API/V1/addAndUpdateProperty", verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, address, bedrooms, bathrooms, rentOrDeposit, availableDate, orignalImages, thumbnailImages, description, leaseTerms, squareFeet, amenities, loginUserRole, loginUserId } = req.body;
        if (!address) {
            res.status(400).json({ msg: "Please provide property address." });
        }
        else if (!bedrooms) {
            res.status(400).json({ msg: "Please provide bedrooms details." });
        }
        else if (!bathrooms) {
            res.status(400).json({ msg: "Please provide bathrooms details." });
        }
        else if (!rentOrDeposit) {
            res.status(400).json({ msg: "Please provide rent or security deposit amount." });
        }
        else if (!availableDate) {
            res.status(400).json({ msg: "Please provide property available Date." });
        }
        else {
            if ("Landlord".includes(loginUserRole)) {
                if (_id == "0") {
                    req.body.userId = loginUserId;
                    req.body.createdBy = loginUserId;
                    delete req.body._id;
                    const propertyData = yield new propertyModel(req.body).save();
                    if (propertyData) {
                        res.status(200).json({ msg: "Post added successfuly.", data: propertyData });
                    }
                    else {
                        res.status(400).json({ msg: "Something went wrong please try again.", data: propertyData });
                    }
                }
                else {
                    const propertyData = yield propertyModel.findByIdAndUpdate({ _id: _id }, {
                        address,
                        bedrooms,
                        bathrooms,
                        rentOrDeposit,
                        availableDate,
                        orignalImages,
                        thumbnailImages,
                        description,
                        leaseTerms,
                        squareFeet,
                        amenities,
                        updatedBy: loginUserId
                    }, { new: true });
                    if (propertyData) {
                        res.status(200).json({ msg: "Post update successfuly.", data: propertyData });
                    }
                    else {
                        res.status(400).json({ msg: "Something went wrong please try again.", data: propertyData });
                    }
                }
            }
            else {
                res.status(400).json({ msg: 'You do not have permission to access.' });
            }
        }
    }
    catch (err) {
        res.status(400).json({ msg: err.message });
    }
}));
// All property service
router.get("/API/V1/allProperty", verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginUserRole, loginUserId } = req.body;
        let dynamicWhere = { isDeleted: false };
        if (loginUserRole == "Landlord") {
            dynamicWhere = { userId: loginUserId, isDeleted: false };
        }
        const propertyData = yield propertyModel.find(dynamicWhere).sort({ _id: -1 });
        if (propertyData) {
            res.status(200).json({ msg: "Post details find successfuly.", data: propertyData });
        }
        else {
            res.status(400).json({ msg: "Something went wrong please try again.", data: propertyData });
        }
    }
    catch (err) {
        res.status(400).json({ msg: err.message });
    }
}));
// Find single property service
router.get("/API/V1/:_id/property", verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyData = yield propertyModel.findOne({ _id: req.params._id, isDeleted: false });
        if (propertyData) {
            res.status(200).json({ msg: "Post details find successfuly.", data: propertyData });
        }
        else {
            res.status(400).json({ msg: "Something went wrong please try again.", data: propertyData });
        }
    }
    catch (err) {
        res.status(400).json({ msg: err.message });
    }
}));
// Delete single property service
router.put("/API/V1/deleteProperty", verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, isDeleted } = req.body;
        const propertyData = yield propertyModel.findByIdAndUpdate({ _id: _id }, {
            isDeleted: isDeleted,
            updatedBy: req.body.loginUserId,
        });
        if (propertyData) {
            res.status(200).json({ msg: "Property details find successfuly.", data: propertyData });
        }
        else {
            res.status(400).json({ msg: "Something went wrong please try again.", data: propertyData });
        }
    }
    catch (err) {
        res.status(400).json({ msg: err.message });
    }
}));
module.exports = router;
