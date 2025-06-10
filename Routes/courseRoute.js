const express = require('express');
const Course = require('../Model/courseModule.js');
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

module.exports = router;
