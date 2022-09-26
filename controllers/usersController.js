const router = require("express").Router();
const userModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {verifyToken,SendgridEmail}=require("./authController");

// Server Is Working Service
router.get("/", (req, res) => {
  try {
    res.status(200).send(`<b> Backend api server is running. </b>`);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// User Registration Service
router.post("/API/V1/registation", async (req, res) => {
  try {
    let { firstName, lastName, email, password, role } = req.body;
    if (!firstName) {
      res.status(400).json({ msg: "Please provide firstname." });
    } else if (!lastName) {
      res.status(400).json({ msg: "Please provide lastname." });
    } else if (!email) {
      res.status(400).json({ msg: "Please provide email address." });
    } else if (!password) {
      res.status(400).json({ msg: "Please provide password." });
    } else if (!role) {
      res.status(400).json({ msg: "Please provide role." });
    } else {
      const user = await userModel.findOne({ email: req.body.email });
      if (user) {
        res.status(400).json({ msg: "User with given email already exist!" });
      } else {
        req.body.password = await bcrypt.hash(
          req.body.password,
          parseInt(process.env.SALT)
        );
        const userData=await new userModel(req.body).save();
        let optcode=Math.floor((Math.random() * 900000)+100000);
        const mailOptions = {
          from: `Curated Tenancy<${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "OTP: For Email Verification",
          html: `<b>Please Reply on : ${process.env.EMAIL_USER}</b><html> <body> <table style="margin: 0; padding: 0; width: 100%; font-size: 100%; line-height: 1.65; border-collapse: collapse; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;"> <tbody> <tr style="margin:0; padding:0; width: 100%; border-collapse: collapse;"> <td style="margin: 0; padding: 10px; border-spacing:0; text-align: left;"> <h2 style="font-size: 28px; margin-bottom: 20px;">OTP Verification</h2> <p style="margin-bottom:0px;">Below is your otp for&nbsp;<strong>Curated Tenancy</strong>.</p></p><p>Hello ${firstName} ${lastName}</p> </td> </tr> <tr> <td style="margin: 0; padding: 10px; border-spacing:0; border-collapse: collapse;"> <p style="margin:0;"><strong>OTP: </strong><span>${optcode}</span></p> &nbsp; <p style="margin:0px;">If you have any issues please call us at (${process.env.PHONE_CODE} ${process.env.PHONE_NUMBER})</p> </td> </tr> </tbody> </table> </body></html>`,
          // text: "That was easy!",
        };
        SendgridEmail(mailOptions, async (data)=> {
          if (data.res == 200) {
              await userModel.findByIdAndUpdate({_id:userData._id},{
                confirmationCode:optcode
              })
              res.status(200).json({ msg: 'You have successfully registered. Please check your email account.' });
          } else {
              res.status(500).json({ msg: data.msg });
          }
        })
      }
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Login Service
router.post("/API/V1/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ msg: "Please provide email address." });
    } else if (!password) {
      res.status(400).json({ msg: "Please provide password." });
    } else {
      const user = await userModel.findOne(
        { email: req.body.email },
        { isDeleted: false }
      );
      if (!user) {
        res.status(400).json({ msg: "Invaild email or password." });
      }
      if(user.userVerify == false) {res.status(400).json({ msg: "Your email address is not verify." })}
      const vaildPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!vaildPassword) {
        res.status(400).json({ msg: "Invaild email or password." });
      }
      const token = jwt.sign(
        {
          data: { userId: user._id, role: user.role, email: user.email },
        },
        process.env.JWT_SECRECT
      );
      res.status(200).json({ msg: "Login successfully.", data: token });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Email verification otp
router.post('/API/V1/otpCreate',async(req,res)=>{
  try {
      const {email}=req.body;
      if(!email){
        res.status(400).json({msg:"Please provide email address."})
      }else{
        const user = await userModel.findOne({ email: req.body.email,isDeleted:false });
          if (!user) {
            res.status(400).json({ msg: "Please provide register email address." });
          } else {
            let optcode=Math.floor((Math.random() * 900000)+100000);
            const mailOptions = {
              from: `Curated Tenancy<${process.env.EMAIL_USER}>`,
              to: user.email,
              subject: "OTP: For Email Verification",
              html: `<b>Please Reply on : ${process.env.EMAIL_USER}</b><html> <body> <table style="margin: 0; padding: 0; width: 100%; font-size: 100%; line-height: 1.65; border-collapse: collapse; font-family: 'Avenir Next', 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;"> <tbody> <tr style="margin:0; padding:0; width: 100%; border-collapse: collapse;"> <td style="margin: 0; padding: 10px; border-spacing:0; text-align: left;"> <h2 style="font-size: 28px; margin-bottom: 20px;">OTP Verification</h2> <p style="margin-bottom:0px;">Below is your otp for&nbsp;<strong>Curated Tenancy</strong>.</p></p><p>Hello ${user.firstName} ${user.lastName}</p> </td> </tr> <tr> <td style="margin: 0; padding: 10px; border-spacing:0; border-collapse: collapse;"> <p style="margin:0;"><strong>OTP: </strong><span>${optcode}</span></p> &nbsp; <p style="margin:0px;">If you have any issues please call us at (${process.env.PHONE_CODE} ${process.env.PHONE_NUMBER})</p> </td> </tr> </tbody> </table> </body></html>`,
            };
            SendgridEmail(mailOptions, async (data)=> {
              if (data.res == 200) {
                  await userModel.findByIdAndUpdate({_id:userData._id},{
                    confirmationCode:optcode
                  })
                  res.status(200).json({ msg: 'Code send successfully. Please check your email account.' });
              } else {
                  res.status(500).json({ msg: data.msg });
              }
            })
        }
      }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
})

// Otp verification
router.put('/API/V1/otpVerify',async(req,res)=>{
  try {
    const {email,confirmationCode}=req.body;
    if(!email){
      res.status(400).json({msg:"Please provide email address."})
    }else if(!confirmationCode){
      res.status(400).json({msg:"Please confirmation code."})
    }else{
      const userData=await userModel.findOne({email:email,isDeleted:false})
      if(!userData){ res.status(400).json({ msg: 'User does not exist.' }); }
      if(userData.confirmationCode !="" && confirmationCode==userData.confirmationCode){
        userData.confirmationCode="";
        userData.isVerify=true;
        await userData.save();
        res.status(200).json({ msg: 'User email address verify successfully.' });
      }else{
        res.status(400).json({ msg: 'Please provide vaild confirmation code.' });
      }
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
})


module.exports = router;
