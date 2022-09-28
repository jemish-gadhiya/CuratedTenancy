"use strict";
const mongoose = require("mongoose");
const { DB_URL } = process.env;
module.exports = () => {
    try {
        mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database conntected successfully.");
    }
    catch (err) {
        console.log(err);
    }
};
