import express from "express";
import dotenv from "dotenv";
import setupSwagger from "./swagger.js";
import All_Models from "./Utils/All_Models.js";
import All_User_Routes from "./Utils/All_User_Routes.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import sequelize from "./Utils/dbConnection.js";
import cors from "cors";



dotenv.config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

const PORT = process.env.PORT || 5010;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));


All_Models;


All_User_Routes(app);

app.get("/", (req, res) => {
    res.send(`<h1 style="color:black ;text-align:center;font-size:50px;font-weight:bold; margin-top:100px;">Welcome to the HRMS TEMP BACKEND</h1>`);
});

setupSwagger(app);

sequelize.sync().then(() => {
    console.log('Database & tables created!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

app.listen(PORT, () => {
    try {
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.log("Server is not running");
    }
});