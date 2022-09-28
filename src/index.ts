import express from "express";
import dotenv from "dotenv";
dotenv.config();
const cors=require("cors");
const app = express();
const db=require('./config/dbconfig');

// Database connection
db()

// Middlewares
app.use(express.json());
app.use(cors());

// Import Controller
app.use('/',require('./controllers/usersController'));
app.use('/',require('./controllers/propertyController'));

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('----------------------------------------------');
    console.log(`Server is running on ${port}`);
});
