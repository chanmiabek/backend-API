const express = require('express');
const router = express.Router();
const User = require('../Model/userModule');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./auth'); 
const axios = require('axios'); 
const nodemailer = require('nodemailer'); 
const crypto = require('crypto');



const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});

// Create a new user
router.post("/register",  async (req, res) => {
    const { fullName, email, password, role } = req.body; // Added role to registration
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ status: "01", message: "User already exists" });
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, password: hashedPassword, role: role || 'instructor'|| 'student' });
        const response = await newUser.save();
        return res.status(201).json({
            status: "00",
            message: "Account created successfully. Proceed to login",
            data: response
        });
    }
});

// create login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ status: "01", message: "Email and password are required" });
    }

    try {
        // Check if the user exists

        const userDetails = await User.findOne({ email });
        if (!userDetails) {
            return res.status(404).json({ status: "01", message: "User not found" });
        }
        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, userDetails.password);
        if (!isPasswordValid) {
            console.log("Invalid password");
            return res.status(401).json({ status: "01", message: "Invalid password" });
        }

        // Generate a token
        const token = jwt.sign({ id: userDetails._id, role: userDetails.role }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Include role in token
        return res.status(200).json({
            status: "00",
            message: "Login successful",
            data: {
                id: userDetails._id,
                fullName: userDetails.fullName,
                email: userDetails.email,
                role: userDetails.role
            },
            token: token,
            role: userDetails.role 
        });
    } catch (error) {
        console.log("Error during login:", error);
        return res.status(500).json({ status: "01", message: "Internal server error" });
    }
});

// Get user profile (protected route, requires auth middleware)
router.get("/profile", auth, async (req, res) => { 
    try {
        
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ status: "01", message: "User not found" });
        }
        return res.status(200).json({ status: "00", message: "Profile retrieved successfully", data: user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ status: "01", message: "Internal server error" });
    }
});

// --- FORGOT PASSWORD API ---
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ status: "01", message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            
            return res.status(200).json({ status: "00", message: "If a user with that email exists, a password reset link has been sent." });
        }

    
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetExpires = Date.now() + 3600000; // 1 hour from now

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpires;
        await user.save();

        // Construct the reset URL for the frontend
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`; // Ensure FRONTEND_URL is set in .env

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset Request',
            html: `
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
                <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                <p>This link will expire in 1 hour.</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ status: "00", message: "Password reset link sent to your email." });

    } catch (error) {
        console.error("Error in forgot-password:", error);
        return res.status(500).json({ status: "01", message: "Internal server error during password reset request." });
    }
});

// --- RESET PASSWORD API ---
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ status: "01", message: "New password is required." });
    }

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Check if token is not expired
        });

        if (!user) {
            return res.status(400).json({ status: "01", message: "Password reset token is invalid or has expired." });
        }

        // Hash the new password and update
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined; // Clear the token
        user.resetPasswordExpires = undefined; // Clear the expiration
        await user.save();

        // Optionally, send a confirmation email that password has been reset
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Your password has been changed',
            html: `
                <p>Hello,</p>
                <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>
                <p>If you did not make this change, please contact support immediately.</p>
            `,
        };
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ status: "00", message: "Password has been reset successfully." });

    } catch (error) {
        console.error("Error in reset-password:", error);
        return res.status(500).json({ status: "01", message: "Internal server error during password reset." });
    }
});

module.exports = router;