const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const db=require('./config/dbconfig');

// Database connection
db()

// Middlewares
app.use(express.json());
app.use(cors());

// Import Controller
app.use('/',require('./controllers/usersController'));
app.use('/',require('./controllers/postController'));
app.use('/',require('./controllers/propertyController'));

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('----------------------------------------------');
    console.log(`Server is running on ${port}`);
});
