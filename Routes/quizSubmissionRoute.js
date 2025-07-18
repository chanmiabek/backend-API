const express = require('express');
const router = express.Router();
const QuizSubmission = require('../Model/quizSubmissionModule');
//const auth = require('../middleware/auth');
//const checkRole = require('../middleware/roles');

// ✅ Submit quiz (user)
router.post('/', async(req, res) => {
  const userId = req.user.id;
  const { quiz } = req.body;

  try {
    // Check for existing submission
    const existing = await QuizSubmission.findOne({ user: userId, quiz });
    if (existing) {
      return res.status(400).json({ msg: 'You already submitted this quiz.' });
    }

    const submission = new QuizSubmission({ user: userId, quiz });
    await submission.save();

    res.status(201).json({ msg: 'Quiz submitted successfully', submission });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to submit quiz', error: err.message });
  }
});

// ✅ Get all submissions (admin/teacher only)
router.get('/', async(req, res) => {
  try {
    const submissions = await QuizSubmission.find()
      .populate('user', 'name email')
      .populate('quiz', 'title');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch submissions', error: err.message });
  }
});

// ✅ Get submissions by user ID (admin/teacher or the user themself)
router.get('/user/:userId', async(req, res) => {
  const userId = req.params.userId;
  if (userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'teacher') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  try {
    const submissions = await QuizSubmission.find({ user: userId })
      .populate('quiz', 'title');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching user submissions', error: err.message });
  }
});

// ✅ Get submissions by quiz ID (admin/teacher only)
router.get('/quiz/:quizId',  async(req, res) => {
  try {
    const submissions = await QuizSubmission.find({ quiz: req.params.quizId })
      .populate('user', 'name email');
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching quiz submissions', error: err.message });
  }
});
module.exports = router;
