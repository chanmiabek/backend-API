const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: {type: String, required: true, },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);
