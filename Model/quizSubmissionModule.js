const mongoose = require("mongoose");

const quizSubmissionSchema = new mongoose.Schema({
    
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz'},
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizSubmission', quizSubmissionSchema);