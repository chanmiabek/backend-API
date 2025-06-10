const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const courseRouter = require('./Routes/courseRoute.js');
const userRouter = require('./Routes/userRoutes.js');

const app = express();
//loads the environment
dotenv.config();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

//Middleware
app.use(cors());
app.use(bodyParser.json());

//defining the routes with the APIs
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

//connecting to the mongo db
mongoose.connect(MONGO_URL).then(()=>{
    console.log("Connected to db successfully");
    app.listen(PORT,()=>{
        console.log(`Server running on port: ${PORT}`);
    })
}
)
.catch((error)=>{
    console.log(error);
})
