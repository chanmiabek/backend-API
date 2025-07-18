const express = require('express');
const router = express.Router();
const Announcement = require('../Model/announcementModule.js');
//const auth = require('./auth.js');

// @route   POST /api/announcement
router.post('/',  async (req, res) => {
  const { course, message } = req.body;

  try {
    const announcement = new Announcement({ course, message });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   GET /api/announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find().populate('course', 'title');
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   GET /api/announcements/:courseId
router.get('/:courseId', async (req, res) => {
  try {
    const announcements = await Announcement.find({ course: req.params.courseId })
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   DELETE /api/announcements/:id
router.delete('/:id', async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
