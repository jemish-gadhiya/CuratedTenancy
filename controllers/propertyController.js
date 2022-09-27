const router = require("express").Router();
const propertyModel = require("../models/propertyModel");
const {verifyToken}=require("./authController");
const moment=require("moment");

// Add and update property service
router.post("/API/V1/addAndUpdateProperty", verifyToken ,async (req, res) => {
  try {
    let { _id, address, bedrooms, bathrooms,rentOrDeposit,availableDate,propertyImages,description,leaseTerms,squareFeet,amenities,loginUserRole,loginUserId } = req.body;
    if (!address) {
      res.status(400).json({ msg: "Please provide property address." });
    } else if (!bedrooms) {
      res.status(400).json({ msg: "Please provide bedrooms details." });
    } else if (!bathrooms) {
      res.status(400).json({ msg: "Please provide bathrooms details." });
    } else if (!rentOrDeposit) {
      res.status(400).json({ msg: "Please provide rent or security deposit amount." });
    } else if (!availableDate) {
      res.status(400).json({ msg: "Please provide property available Date." });
    } else {
        if("Landlord".includes(loginUserRole)){
            if (_id == "0") {
                req.body.userId=loginUserId;
                req.body.createdBy=loginUserId;
                delete req.body._id;
                const propertyData = await new propertyModel(req.body).save();
                if (propertyData) {
                res.status(200).json({ msg: "Post added successfuly.",data:propertyData});
                } else {
                res.status(400).json({ msg: "Something went wrong please try again.",data:propertyData});  
                }
            } else {
                const propertyData = await propertyModel.findByIdAndUpdate({_id:_id},{
                    address,
                    bedrooms,
                    bathrooms,
                    rentOrDeposit,
                    availableDate,
                    propertyImages,
                    description,
                    leaseTerms,
                    squareFeet,
                    amenities,
                    updatedBy:loginUserId
                },{new: true})
                if (propertyData) {
                    res.status(200).json({ msg: "Post update successfuly.",data:postData});
                } else {
                    res.status(400).json({ msg: "Something went wrong please try again.",data:postData});  
                }
            }
        }else{
            res.status(400).json({ msg: 'You do not have permission to access.' });
        }
    }
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// All property service
router.get("/API/V1/allProperty", verifyToken ,async (req, res) => {
    try {
        const {loginUserRole,loginUserId}=req.body;
        let dynamicWhere={isDeleted:false};
        if(loginUserRole == "Landlord"){
            dynamicWhere={userId:loginUserId,isDeleted:false}
        }
        const propertyData = await propertyModel.find(dynamicWhere);
        if (propertyData) {
            res.status(200).json({ msg: "Post details find successfuly.",data:propertyData});
        } else {
            res.status(400).json({ msg: "Something went wrong please try again.",data:propertyData});  
        }
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
});

// Find single property service
router.get("/API/V1/:_id/property", verifyToken ,async (req, res) => {
    try {
        const propertyData = await propertyModel.findOne({_id:req.params._id,isDeleted:false});
        if (propertyData) {
            res.status(200).json({ msg: "Post details find successfuly.",data:propertyData});
        } else {
            res.status(400).json({ msg: "Something went wrong please try again.",data:propertyData});  
        }
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
});

// Delete single property service
router.put("/API/V1/deleteProperty", verifyToken ,async (req, res) => {
    try {
        const {_id,isDeleted}=req.body;
        const propertyData = await propertyModel.findByIdAndUpdate({_id:_id},{
            isDeleted:isDeleted,
            updatedBy: req.body.loginUserId,
        });
        if (propertyData) {
            res.status(200).json({ msg: "Property details find successfuly.",data:propertyData});
        } else {
            res.status(400).json({ msg: "Something went wrong please try again.",data:propertyData});  
        }
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
});

module.exports = router;
