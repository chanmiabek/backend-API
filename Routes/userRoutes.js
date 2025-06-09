const express = require('express');
const router = express.Router();
const user = require('../Model/userModule');

// Create a new user
router.post("/user/register", async (req, res) =>{
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
