const express = require('express');
const router = express.Router();
const Progress = require('../Model/progressModule');
//const auth = require('../middleware/auth');
//const checkRole = require('../middleware/roles');

// ✅ Create or Update Progress for a lesson
router.post('/', async(req, res) => {
  const { lesson, status } = req.body;
  const user = req.user.id;

  try {
    // Check if progress already exists
    let progress = await Progress.findOne({ user, lesson });

    if (progress) {
      progress.status = status;
      progress.updateAt = Date.now();
      await progress.save();
      return res.json(progress);
    }

    // If not exists, create new progress
    progress = new Progress({ user, lesson, status });
    await progress.save();
    res.status(201).json(progress);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update progress', error: err.message });
  }
});

// ✅ Get progress for logged-in user
router.get('/user', async(req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .populate('lesson', 'title contentType contentUrl');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch progress', error: err.message });
  }
});

// ✅ Get all user progress (admin/teacher only)
router.get('/',  async(_req, res) => {
  try {
    const progress = await Progress.find()
      .populate('user', 'name email')
      .populate('lesson', 'title');
    res.json(progress);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch all progress', error: err.message });
  }
});

// ✅ Get progress for a specific lesson for current user
router.get('/lesson/:lessonId', async(req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user.id,
      lesson: req.params.lessonId
    }).populate('lesson', 'title contentType contentUrl');

    if (!progress) {
      return res.status(404).json({ msg: 'Progress not found' });
    }

    res.json(progress);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch lesson progress', error: err.message });
  }
});

module.exports = router;
