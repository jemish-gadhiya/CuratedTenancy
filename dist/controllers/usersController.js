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
const userModel = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const { verifyToken, mailgunEmail, encrypt, decrypt } = require("./authController");
const router = express_1.default.Router();
// Server Is Working Service
router.get("/", (req, res) => {
    try {
        res.status(200).send(`<b> Backend api server is running. </b>`);
    }
    catch (err) {
        res.status(400).json({ msg: err.message });
    }
});
// User Registration Service
router.post("/API/V1/registation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { firstName, lastName, email, password, role, moblie } = req.body;
        if (!firstName) {
            res.status(400).json({ msg: "Please provide firstname." });
        }
        else if (!lastName) {
            res.status(400).json({ msg: "Please provide lastname." });
        }
        else if (!email) {
            res.status(400).json({ msg: "Please provide email address." });
        }
        else if (!password) {
            res.status(400).json({ msg: "Please provide password." });
        }
        else if (!role) {
            res.status(400).json({ msg: "Please provide role." });
        }
        else if (!moblie) {
            res.status(400).json({ msg: "Please provide moblie number." });
        }
        else {
            const user = yield userModel.findOne({ email: req.body.email });
            if (user) {
                res.status(400).json({ msg: "User with given email already exist!" });
            }
            else {
                let optcode = Math.floor((Math.random() * 900000) + 100000);
                const mailOptions = {
                    from: `Curated Tenancy<${process.env.FROM_EMAIL}>`,
                    to: email,
                    subject: "OTP: For Email Verification",
                    html: `<b>Please Reply on : ${process.env.FROM_EMAIL}</b><html> <body> <table style="margin: 0; padding: 0; width: 100%; font-size: 100%; line-height: 1.65; border-collapse: collapse; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;"> <tbody> <tr style="margin:0; padding:0; width: 100%; border-collapse: collapse;"> <td style="margin: 0; padding: 10px; border-spacing:0; text-align: left;"> <h2 style="font-size: 28px; margin-bottom: 20px;">OTP Verification</h2> <p style="margin-bottom:0px;">Below is your otp for&nbsp;<strong>Curated Tenancy</strong>.</p></p><p>Hello ${firstName} ${lastName}</p> </td> </tr> <tr> <td style="margin: 0; padding: 10px; border-spacing:0; border-collapse: collapse;"> <p style="margin:0;"><strong>OTP: </strong><span>${optcode}</span></p> &nbsp; <p style="margin:0px;">If you have any issues please call us at (${process.env.PHONE_CODE} ${process.env.PHONE_NUMBER})</p> </td> </tr> </tbody> </table> </body></html>`,
                    // text: "That was easy!",
                };
                mailgunEmail(mailOptions, (data) => __awaiter(void 0, void 0, void 0, function* () {
                    if (data.res == 200) {
                        req.body.password = encrypt(password);
                        req.body.confirmationCode = optcode;
                        const userData = yield new userModel(req.body).save();
                        res.status(200).json({ msg: 'You have successfully registered. Please check your email account.' });
                    }
                    else {
                        res.status(400).json({ msg: data.msg });
                    }
                }));
            }
        }
    }
    catch (err) {
        res.status(400).json({ msg: err.message });
    }
}));
// Login Service
router.post("/API/V1/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email) {
            res.status(400).json({ msg: "Please provide email address." });
        }
        else if (!password) {
            res.status(400).json({ msg: "Please provide password." });
        }
        else {
            const user = yield userModel.findOne({ email: req.body.email }, { isDeleted: false });
            if (!user) {
                res.status(400).json({ msg: "Invaild email or password." });
            }
            if (user.isVerified == false) {
                res.status(400).json({ msg: "Please first verify your email address." });
            }
            if (!(password == decrypt(user.password))) {
                res.status(400).json({ msg: "Invaild email or password." });
            }
            else {
                const token = jwt.sign({
                    data: { userId: user._id, role: user.role, email: user.email },
                }, process.env.JWT_SECRECT);
                res.status(200).json({ msg: "Login successfully.", data: token });
            }
        }
    }
    catch (err) {
        res.status(400).json({ msg: err.message });
    }
}));
// Email verification otp
router.post('/API/V1/otpCreate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ msg: "Please provide email address." });
        }
        else {
            const user = yield userModel.findOne({ email: req.body.email, isDeleted: false });
            if (!user) {
                res.status(400).json({ msg: "Please provide register email address." });
            }
            else {
                let otpcode = Math.floor((Math.random() * 900000) + 100000);
                const mailOptions = {
                    from: `Curated Tenancy<${process.env.FROM_EMAIL}>`,
                    to: user.email,
                    subject: "OTP: For Email Verification",
                    // html: `<b>Please Reply on : ${process.env.FROM_EMAIL}</b><html> <body> <table style="margin: 0; padding: 0; width: 100%; font-size: 100%; line-height: 1.65; border-collapse: collapse; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;"> <tbody> <tr style="margin:0; padding:0; width: 100%; border-collapse: collapse;"> <td style="margin: 0; padding: 10px; border-spacing:0; text-align: left;"> <h2 style="font-size: 28px; margin-bottom: 20px;">OTP Verification</h2> <p style="margin-bottom:0px;">Below is your otp for&nbsp;<strong>Curated Tenancy</strong>.</p></p><p>Hello ${user.firstName} ${user.lastName}</p> </td> </tr> <tr> <td style="margin: 0; padding: 10px; border-spacing:0; border-collapse: collapse;"> <p style="margin:0;"><strong>OTP: </strong><span>${otpcode}</span></p> &nbsp; <p style="margin:0px;">If you have any issues please call us at (${process.env.PHONE_CODE} ${process.env.PHONE_NUMBER})</p> </td> </tr> </tbody> </table> </body></html>`,
                    template: "accountverificationemail",
                    'h:X-Mailgun-Variables': `{"fromEmail": "${process.env.FROM_EMAIL}","firstName":"${user.firstName}","lastName":"${user.lastName}","otpcode":"${otpcode}}"`
                };
                mailgunEmail(mailOptions, (data) => __awaiter(void 0, void 0, void 0, function* () {
                    if (data.res == 200) {
                        yield userModel.findByIdAndUpdate({ _id: user._id }, {
                            confirmationCode: otpcode
                        });
                        res.status(200).json({ msg: 'Code send successfully. Please check your email account.' });
                    }
                    else {
                        res.status(400).json({ msg: data.msg });
                    }
                }));
            }
        }
    }
    catch (err) {
        res.status(400).json({ msg: err.message });
    }
}));
// Otp verification
router.put('/API/V1/otpVerify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, confirmationCode } = req.body;
        if (!email) {
            res.status(400).json({ msg: "Please provide email address." });
        }
        else if (!confirmationCode) {
            res.status(400).json({ msg: "Please enter confirmation code." });
        }
        else {
            const userData = yield userModel.findOne({ email: email, isDeleted: false });
            if (!userData) {
                res.status(400).json({ msg: 'User does not exist.' });
            }
            if (userData.confirmationCode != "" && confirmationCode == userData.confirmationCode) {
                userData.confirmationCode = "";
                userData.isVerified = true;
                yield userData.save();
                res.status(200).json({ msg: 'User email address verify successfully.' });
            }
            else {
                res.status(400).json({ msg: 'Please provide vaild confirmation code.' });
            }
        }
    }
    catch (err) {
        res.status(400).json({ msg: err.message });
    }
}));
module.exports = router;
