const express = require('express');
const router = express.Router();
const Quiz = require('../Model/quizModule');
//const auth = require('../middleware/auth');
//const checkRole = require('../middleware/roles');

// ✅ Create Quiz (Admin/Teacher only)
router.post('/', async(req, res) => {
  const { module, title, totalMark, question } = req.body;

  try {
    const quiz = new Quiz({ module, title, totalMark, question });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create quiz', error: err.message });
  }
});

// ✅ Get all quizzes
router.get('/', async(req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('module', 'title')
      .populate('question', 'text options correctAnswer');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch quizzes', error: err.message });
  }
});

// ✅ Get quizzes by module ID
router.get('/module/:moduleId', async(req, res) => {
  try {
    const quizzes = await Quiz.find({ module: req.params.moduleId })
      .populate('question', 'text options correctAnswer');
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch module quizzes', error: err.message });
  }
});

// ✅ Get single quiz by ID
router.get('/:id', async(req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('module', 'title')
      .populate('question', 'text options correctAnswer');
    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch quiz', error: err.message });
  }
});

// ✅ Update quiz
router.put('/:id', async(req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedQuiz);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update quiz', error: err.message });
  }
});

// ✅ Delete quiz
router.delete('/:id', async(req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Quiz deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete quiz', error: err.message });
  }
});

module.exports = router;
