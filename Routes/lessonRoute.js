const express = require('express');
const router = express.Router();
const Lesson = require('../Model/lessonModule');
//const auth = require('../middleware/auth');
//const checkRole = require('../middleware/roles');

// ✅ Create Lesson (Only teacher/admin)
router.post('/', async(req, res) => {
  const { module, title, contentType, contentUrl, order } = req.body;

  try {
    const lesson = new Lesson({ module, title, contentType, contentUrl, order });
    await lesson.save();
    res.status(201).json(lesson);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create lesson', error: err.message });
  }
});

// ✅ Get All Lessons (for all users)
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.find().populate('module', 'title');
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch lessons', error: err.message });
  }
});

// ✅ Get Lessons by Module ID (students/teachers)
router.get('/module/:moduleId', async(req, res) => {
  try {
    const lessons = await Lesson.find({ module: req.params.moduleId })
      .sort({ order: 1 }); // assuming order is a stringified number like '1', '2'
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch module lessons', error: err.message });
  }
});

// ✅ Update Lesson (Only teacher/admin)
router.put('/:id', async(req, res) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedLesson);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update lesson', error: err.message });
  }
});

// ✅ Delete Lesson (Only teacher/admin)
router.delete('/:id', async(req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Lesson deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete lesson', error: err.message });
  }
});

module.exports = router;
