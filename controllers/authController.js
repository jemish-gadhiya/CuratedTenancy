const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
const SendgridEmail = async (msgOption,callback) => {
    sgMail.send(msgOption,(err,info)=>{
      if (err) {
        callback({ 'res': '500', 'msg': err.message });
      } else {
        callback({ 'res': '200', 'msg': 'Success.', 'data':info });
      }
    })
};

module.exports = { verifyToken, SendgridEmail };
