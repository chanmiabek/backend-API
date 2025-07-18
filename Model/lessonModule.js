const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
    
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module'},
    title: String,
    contentType: { type: String, enum: ['video', 'pdf', 'text', 'quiz']},
    contentUrl: String,
    order: String
});

module.exports = mongoose.model('Lesson', lessonSchema);