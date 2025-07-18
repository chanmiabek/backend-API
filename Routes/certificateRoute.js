const express = require('express');
const router = express.Router();
const Certificate = require('../Model/certificateModule');
//const auth = require('./auth');
//const checkRole = require('../middleware/roles');

// ✅ Issue certificate (Admin/Teacher only)
router.post('/api/certificate', async (req, res) => {
  const { user, course, certificate } = req.body;

  try {
    // Check if certificate already issued
    const exists = await Certificate.findOne({ user, course });
    if (exists) {
      return res.status(400).json({ msg: 'Certificate already issued to this user for this course.' });
    }

    const newCert = new Certificate({ user, course, certificate });
    await newCert.save();
    res.status(201).json(newCert);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to issue certificate', error: err.message });
  }
});

// ✅ Get all certificates (Admin only)
router.get('/', async (req, res) => {
  try {
    const certs = await Certificate.find()
      .populate('user', 'name email')
      .populate('course', 'title');
    res.json(certs);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch certificates', error: err.message });
  }
});

// ✅ Get certificates for current user
router.get('/my',  async (req, res) => {
  try {
    const certs = await Certificate.find({ user: req.user.id })
      .populate('course', 'title');
    res.json(certs);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching your certificates', error: err.message });
  }
});

// ✅ Get certificate by user ID (admin/teacher only)
router.get('/user/:userId', async (req, res) => {
  try {
    const certs = await Certificate.find({ user: req.params.userId })
      .populate('course', 'title');
    res.json(certs);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch user certificates', error: err.message });
  }
});

// ✅ Get certificate by course and user (for download check)
router.get('/user/:userId/course/:courseId',  async (req, res) => {
  try {
    const cert = await Certificate.findOne({
      user: req.params.userId,
      course: req.params.courseId
    }).populate('course', 'title');

    if (!cert) return res.status(404).json({ msg: 'Certificate not found' });

    res.json(cert);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching certificate', error: err.message });
  }
});
module.exports = router;
