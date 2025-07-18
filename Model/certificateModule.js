const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
    issueAt: { type: Date, default: Date.now },
    certificate: String
});

module.exports = mongoose.model('Certificate', certificateSchema);