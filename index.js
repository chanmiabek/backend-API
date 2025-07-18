const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const courseRouter = require('./Routes/courseRoute.js');
const userRouter = require('./Routes/userRoutes.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./Routes/auth.js');
const announcementRouter = require('./Routes/announcementRoute.js');
const certificateRouter = require('./Routes/certificateRoute.js');
const enrollmentRouter = require('./Routes/enrollmentRoute.js');
const lessonRouter = require('./Routes/lessonRoute.js');
const quizRouter = require('./Routes/quizRoute.js');
const moduleRouter = require('./Routes/moduleRoute');
const progressRouter = require('./Routes/progressRoute.js');
const quizSubmissionRouter = require('./Routes/quizSubmissionRoute.js');
//const assignmentSubmissionRouter = require('./Routes/assignmentSubmissionRoute.js');
//const auth = require('./Routes/auth.js');


// Initialize the express app
const app = express();

//loads the environment
dotenv.config();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

//Middleware
app.use(cors());
app.use(bodyParser.json());

//defining the routes with the APIs
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);
app.use("/api/announcement", announcementRouter);
app.use("/api/certificate", certificateRouter);
app.use("/api/enrollment", enrollmentRouter);
app.use("/api/lesson", lessonRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/module", moduleRouter);
//app.use("/api/assignment", assignmentRouter);
app.use("/api/progress", progressRouter);
app.use("/api/quizSubmission", quizSubmissionRouter);
// app.use("/api/assignmentSubmission", assignmentSubmissionRouter);

// Error handling middleware
app.use( (err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ status: "01", message: "Internal Server Error" });
});

//connecting to the mongo db
mongoose.connect(MONGO_URL).then(()=>{
    console.log("Backend-API is Connected to database successfully");
    app.listen(PORT,()=>{
        console.log(`Backend Server is running on port: ${PORT}`);
    })
}
)
.catch((error)=>{
    console.log(error);
})
