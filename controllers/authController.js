const jwt = require("jsonwebtoken");
const cryptoJS = require('crypto-js')
const mailgun=require('mailgun-js')({apiKey:process.env.MAILGUN_KEY,domain:process.env.MAILGUN_DOMIN})

// Jwt token verification
const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization
      ? req.headers.authorization.split(" ")
      : [];
    if (token.length == 0 || token[0] != "Bearer" || token[1] == "") {
      return res
        .status(400)
        .json({ msg: "A token is required for authentication." });
    } else {
      jwt.verify(token[1], process.env.JWT_SECRECT, async (err, data) => {
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
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// Send email funcation
const mailgunEmail = async (msgOption,callback) => {
    await mailgun.messages().send(msgOption,(err,info)=>{
      if (err) {
        console.log(err);
        callback({ 'res': '400', 'msg': err.message });
      } else {
        callback({ 'res': '200', 'msg': 'Success.', 'data':info });
      }
    })
};

// Password Encrypt
function encrypt(text) {
  var encrypt =  cryptoJS.AES.encrypt(text, process.env.PASSWORD_SECRET_KEY).toString();
  return encrypt;
}

// Password Decrypt
function decrypt(text) {
  var decrypt = cryptoJS.AES.decrypt(text, process.env.PASSWORD_SECRET_KEY);
  return decrypt.toString(cryptoJS.enc.Utf8)
}

module.exports = { verifyToken, mailgunEmail, encrypt,decrypt };
