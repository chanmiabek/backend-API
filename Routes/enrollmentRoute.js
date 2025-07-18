const express = require('express');
const router = express.Router();
const Enrollment = require('../Model/enrollmentModule');
//const auth = require('../middleware/auth');
//const checkRole = require('../middleware/roles');

// ✅ Enroll user in course (student or admin can enroll)
router.post('/',  async(req, res) => {
  const { course } = req.body;
  const userId = req.user.id;

  try {
    // Prevent duplicate enrollment
    const alreadyEnrolled = await Enrollment.findOne({ user: userId, course });
    if (alreadyEnrolled) {
      return res.status(400).json({ msg: 'User already enrolled in this course' });
    }

    const enrollment = new Enrollment({ user: userId, course });
    await enrollment.save();

    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ msg: 'Enrollment failed', error: err.message });
  }
});

// ✅ Get all enrollments (admin only)
router.get('/',  async(req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('user', 'name email')
      .populate('course', 'title');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch enrollments', error: err.message });
  }
});

// ✅ Get enrollments by user (student or admin)
router.get('/user/:userId',  async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.params.userId })
      .populate('course', 'title description');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch user enrollments', error: err.message });
  }
});

// ✅ Get enrollments by course (admin or teacher)
router.get('/course/:courseId',  async(req, res) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('user', 'name email');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch enrollments', error: err.message });
  }
});

// ✅ Unenroll (student or admin can remove)
router.delete('/:id',  async(req, res) => {
  try {
    await Enrollment.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Enrollment removed successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to unenroll', error: err.message });
  }
});

module.exports = router;
