import express from 'express';
import Course from '../Model/courseModule.js'; // Changed to match the model name
import { Router } from 'express';
// Importing necessary modules
const router = express.Router();

// Create
router.post('/post', async (req, res) => {
try {
    const newCourse = new Course(req.body)
    const {title} = newCourse;
    const courseExists = await Course.findOne({title});
    if(courseExists){
        return res.status(400).json({status:"01",message:"Course already exists", data:courseExists});
        }
    const course = await Course.create(req.body);
    return res.status(201).json({status:"01",message:"Course created successfully", data:course});
    } catch (err) {
    return res.status(201).json({status:"01",message:err.message});
    }
});

// Read All
router.get('/get-all', async (req, res) => {
try {
    const courses = await Course.find();
    res.json(courses);
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
});

// Read One
router.get('/get-by-id:id', async (req, res) => {
try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
} catch (err) {
    res.status(500).json({ message: err.message });
    }
});

// Update
router.put('/update-course:id', async (req, res) => {
try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
} catch (err) {
    res.status(400).json({ message: err.message });
    }
});

// Delete
router.delete('/delete-course:id', async (req, res) => {
try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
} catch (err) {
    res.status(500).json({ message: err.message });
    }
});

export default Router;
