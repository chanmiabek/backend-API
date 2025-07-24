const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' }, // Added role
    resetPasswordToken: String, 
    resetPasswordExpires: Date,   
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);