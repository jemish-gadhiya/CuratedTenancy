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
const crypto_1 = __importDefault(require("crypto"));
const jwt = require("jsonwebtoken");
const mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMIN });
const algorithm = 'aes-256-ctr';
const password = 'v!24tgYikao&mQp9b*Hs0-7A6';
// Jwt token verification
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers.authorization
            ? req.headers.authorization.split(" ")
            : [];
        if (token.length == 0 || token[0] != "Bearer" || token[1] == "") {
            return res
                .status(400)
                .json({ msg: "A token is required for authentication." });
        }
        else {
            jwt.verify(token[1], process.env.JWT_SECRECT, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return res.status(400).json({ msg: err.message });
                }
                else {
                    req.body.loginUserId = data.data.userId;
                    req.body.loginUserRole = data.data.role;
                    req.body.loginUserEmail = data.data.email;
                    return next();
                }
            }));
        }
    }
    catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});
// Send email funcation
const mailgunEmail = (msgOption, callback) => __awaiter(void 0, void 0, void 0, function* () {
    yield mailgun.messages().send(msgOption, (err, info) => {
        if (err) {
            console.log(err);
            callback({ 'res': '400', 'msg': err.message });
        }
        else {
            callback({ 'res': '200', 'msg': 'Success.', 'data': info });
        }
    });
});
// Password Encrypt
function encrypt(text) {
    let cypher = crypto_1.default.createCipher(algorithm, password);
    let crypted = cypher.update(text, 'utf8', 'hex');
    crypted += cypher.final('hex');
    return crypted;
}
// Password Decrypt
function decrypt(text) {
    let decipher = crypto_1.default.createDecipher(algorithm, password);
    let decoded = decipher.update(text, 'hex', 'utf8');
    decoded += decipher.final('hex');
    return decoded;
}
module.exports = { verifyToken, mailgunEmail, encrypt, decrypt };
