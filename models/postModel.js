const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
    // createdDate: { type: Date, default: Date.now },
    // updatedDate: { type: Date },
  },
  { collection: "post",timestassmps: true }
);

module.exports = mongoose.model("post", postSchema);
