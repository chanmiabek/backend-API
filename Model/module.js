const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({

    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    title: String,
    oder: Number,
    lessons: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson'},
    
});

module.exports = mongoose.model('Module', moduleSchema)