const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson'},
    status: { type: String, enum: ['not started', 'in progress', 'completed'], default: 'not start'},
    updateAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Progress', progressSchema);