const express = require('express');
const router = express.Router();
const Module = require('../Model/module');
//const auth = require('../middleware/auth');
//const checkRole = require('../middleware/roles');

// ✅ Create Module (Admin/Teacher only)
router.post('/', async (req, res) => {
  const { course, title, order, lessons } = req.body;

  try {
    const module = new Module({ course, title, order, lessons });
    await module.save();
    res.status(201).json(module);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create module', error: err.message });
  }
});

// ✅ Get All Modules
router.get('/', async (req, res) => {
  try {
    const modules = await Module.find()
      .populate('course', 'title')
      .populate('lessons', 'title contentType contentUrl');
    res.json(modules);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch modules', error: err.message });
  }
});

// ✅ Get Modules by Course ID
router.get('/course/:courseId', async(req, res) => {
  try {
    const modules = await Module.find({ course: req.params.courseId })
      .sort({ order: 1 })
      .populate('lessons', 'title contentType contentUrl');
    res.json(modules);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch course modules', error: err.message });
  }
});

// ✅ Update Module (Admin/Teacher only)
router.put('/:id',  async (req, res) => {
  try {
    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedModule);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update module', error: err.message });
  }
});

// ✅ Delete Module (Admin/Teacher only)
router.delete('/:id',  async(req, res) => {
  try {
    await Module.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Module deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete module', error: err.message });
  }
});

module.exports = router;
