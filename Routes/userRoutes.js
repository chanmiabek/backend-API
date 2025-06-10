const express = require('express');
const router = express.Router();
const User = require('../Model/userModule');

// Create a new user
router.post("/register", async (req, res) =>{
    const userDetails = new User(req.body);
    const {email} = userDetails;
    const userExists = await User.findOne({email});
    if(userExists){
        return req.status(400).json({status: "01", message: "User already exists"});
    }
    else{
        const response = await User.create(userDetails);
        return res.status(201).json({status: "00",
            message: "User created successfully. proceed to login",
            data: response});
    }
})
// create login route
router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({status: "01", message: "Email and password are required"});
    }

    try {
        const userDetails = await login.findOne({email});
        if(!userDetails){
            return res.status(404).json({status: "01", message: "User not found"});
        }

        if(userDetails.password !== password){
            return res.status(401).json({status: "01", message: "Invalid password"});
        }

        return res.status(200).json({
            status: "00",
            message: "Login successful",
            data: userDetails
        });
    } catch (error) {
        return res.status(500).json({status: "01", message: "Internal server error"});
    }
});
module.exports = router;
