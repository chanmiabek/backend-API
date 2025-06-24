const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const courseRouter = require('./Routes/courseRoute.js');
const userRouter = require('./Routes/userRoutes.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./Routes/auth.js');

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

// Example of protected routes using auth middleware
app.use("/api/logout", auth, (req, res) => {
    // This is a protected route that requires authentication
    res.status(200).json({ status: "00", message: "Logout successful" });
});
app.use("/api/profile", auth, (req, res) => {
    // This is a protected route that requires authentication
    res.status(200).json({ status: "00", message: "Profile accessed successfully", user: req.user });
});
app.get("/", (req, res) => {
    res.status(200).json({ status: "00", message: "Welcome to the Course Management API" });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: "01", message: "Internal Server Error" });
});

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
