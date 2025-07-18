const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course'}
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);