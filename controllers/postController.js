const router = require("express").Router();
const postModel = require("../models/postModel");
const {verifyToken}=require("./authController");
const moment=require("moment");

// Add and update post service
router.post("/API/V1/addAndUpdatePost", verifyToken ,async (req, res) => {
  try {
    let { _id, title, description, link } = req.body;
    if (!title) {
      res.status(400).json({ msg: "Please provide post title." });
    } else if (!description) {
      res.status(400).json({ msg: "Please provide post description." });
    } else if (!link) {
      res.status(400).json({ msg: "Please provide post link." });
    } else {
        if (_id == "0") {
            const postData = await new postModel({
                title: title,
                description: description,
                link: link,
                userId: req.body.loginUserId,
                createdBy: req.body.loginUserId,
            }).save();
            if (postData) {
            res.status(200).json({ msg: "Post added successfuly.",data:postData});
            } else {
            res.status(400).json({ msg: "Something went wrong please try again.",data:postData});  
            }
        } else {
            const postData = await postModel.findByIdAndUpdate({_id:_id},{
                title: title,
                description: description,
                link: link,
                updatedBy: req.body.loginUserId,
            },{new: true})
            if (postData) {
                res.status(200).json({ msg: "Post update successfuly.",data:postData});
            } else {
                res.status(400).json({ msg: "Something went wrong please try again.",data:postData});  
            }
        }
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// All post service
router.get("/API/V1/allPost", verifyToken ,async (req, res) => {
    try {
        const postData = await postModel.find({isDeleted:false});
        if (postData) {
            res.status(200).json({ msg: "Post details find successfuly.",data:postData});
        } else {
            res.status(400).json({ msg: "Something went wrong please try again.",data:postData});  
        }
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
});

// Find single post service
router.get("/API/V1/:_id/post", verifyToken ,async (req, res) => {
    try {
        const postData = await postModel.findOne({_id:req.params._id,isDeleted:false});
        if (postData) {
            res.status(200).json({ msg: "Post details find successfuly.",data:postData});
        } else {
            res.status(400).json({ msg: "Something went wrong please try again.",data:postData});  
        }
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
});

// Find single post service
router.put("/API/V1/deletePost", verifyToken ,async (req, res) => {
    try {
        const {_id,isDeleted}=req.body;
        const postData = await postModel.findByIdAndUpdate({_id:_id},{
            isDeleted:isDeleted,
            updatedBy: req.body.loginUserId,
        });
        if (postData) {
            res.status(200).json({ msg: "Post details find successfuly.",data:postData});
        } else {
            res.status(400).json({ msg: "Something went wrong please try again.",data:postData});  
        }
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
});

module.exports = router;
