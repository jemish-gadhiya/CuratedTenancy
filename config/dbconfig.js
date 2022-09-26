const mongoose = require("mongoose");

module.exports = () => {
  try {
    mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Database conntected successfully.");
  } catch (err) {
    console.log(err);
  }
};
