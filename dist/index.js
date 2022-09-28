"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors = require("cors");
const app = (0, express_1.default)();
const db = require('./config/dbconfig');
// Database connection
db();
// Middlewares
app.use(express_1.default.json());
app.use(cors());
// Import Controller
app.use('/', require('./controllers/usersController'));
app.use('/', require('./controllers/propertyController'));
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log('----------------------------------------------');
    console.log(`Server is running on ${port}`);
});
