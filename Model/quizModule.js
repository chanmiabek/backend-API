const mongoose = require("mongoose");
const { title } = require("process");

const quizSchema = new mongoose.Schema({
    
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module'},
    title: String,
    totalMark: Number,
    question: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question'}]
});

module.exports = mongoose.model('Quiz', quizSchema);