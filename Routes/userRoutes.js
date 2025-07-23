const express = require('express');
const router = express.Router();
const User = require('../Model/userModule');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./auth');
const axios = require('axios');
//const nodemailer = require('nodemailer');


// Create a new user
router.post("/register", async (req, res) =>{
    const { fullName, email, password } = req.body;
    const userExists = await User.findOne({email});

    if(userExists){
        return res.status(400).json({status: "01", message: "User already exists"});
    }
    else{
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({fullName, email, password: hashedPassword});
        const response = await User.create(newUser);
        return res.status(201).json({status: "00",
            message: "Account created successfully. proceed to login",
            data: response});
    }
})



// create login route
router.post("/login", async (req, res) => {
    //console.log("Login request received", req.body);
    const { email, password } = req.body;
    console.log('email from the request', +'', email);
    const userExists = await User.findOne({email});
    if(!email || !password){
        return res.status(400).json({status: "01", message: "Email and password are required"});
    }

    try {
        const userDetails = await User.findOne({email});
        if(!userDetails){
            return res.status(404).json({status: "01", message: "User not found"});
        }
        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, userDetails.password);
        if(!isPasswordValid){
            console.log("Invalid password");
            return res.status(401).json({status: "01", message: "Invalid password"});
        }

        //generate a token
        const token = jwt.sign({ id: userExists.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            status: "00",
            message: "Login successful",
            data: userDetails,
            token: token,
        });
    } catch (error) {
        console.log("Error during login:", error);
        return res.status(500).json({status: "01", message: "Internal server error"});
    }
});

router.get("/profile", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ status: "01", message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ status: "01", message: "User not found" });
        }
        return res.status(200).json({ status: "00", message: "Profile retrieved successfully", data: user });
    } catch (error) {
        return res.status(500).json({ status: "01", message: "Internal server error" });
    }
});
module.exports = router;
