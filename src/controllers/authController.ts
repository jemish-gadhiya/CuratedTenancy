import crypto from "crypto";
const jwt = require("jsonwebtoken");
const mailgun=require('mailgun-js')({apiKey:process.env.MAILGUN_KEY,domain:process.env.MAILGUN_DOMIN})
const algorithm='aes-256-ctr';
const password='v!24tgYikao&mQp9b*Hs0-7A6';

// Jwt token verification
const verifyToken = async (req:any, res:any, next:any) => {
  try {
    let token = req.headers.authorization
      ? req.headers.authorization.split(" ")
      : [];
    if (token.length == 0 || token[0] != "Bearer" || token[1] == "") {
      return res
        .status(400)
        .json({ msg: "A token is required for authentication." });
    } else {
      jwt.verify(token[1], process.env.JWT_SECRECT, async (err:any, data:any) => {
        if (err) {
          return res.status(400).json({ msg: err.message });
        } else {
          req.body.loginUserId = data.data.userId;
          req.body.loginUserRole = data.data.role;
          req.body.loginUserEmail = data.data.email;
          return next();
        }
      });
    }
  } catch (err:any) {
    return res.status(500).json({ msg: err.message });
  }
};

// Send email funcation
const mailgunEmail = async (msgOption:any,callback:any) => {
    await mailgun.messages().send(msgOption,(err:any,info:any)=>{
      if (err) {
        console.log(err);
        callback({ 'res': '400', 'msg': err.message });
      } else {
        callback({ 'res': '200', 'msg': 'Success.', 'data':info });
      }
    })
};

// Password Encrypt
function encrypt(text:any) {
  let cypher=crypto.createCipher(algorithm,password);
  let crypted=cypher.update(text,'utf8','hex');
  crypted += cypher.final('hex');
  return crypted;
}

// Password Decrypt
function decrypt(text:any) {
  let decipher=crypto.createDecipher(algorithm,password);
  let decoded=decipher.update(text,'hex','utf8');
  decoded += decipher.final('hex');
  return decoded;
}

module.exports = { verifyToken, mailgunEmail, encrypt,decrypt };
