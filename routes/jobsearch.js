const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

// Setup file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // make sure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

router.post("/upload-resume", upload.single("resume"), (req, res) => {
    const filePath = req.file.path;

    // Call the Python script with the resume file
    const pythonProcess = spawn("python3", ["./AI/Job_Search.py", filePath]);

    let output = "";
    pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`❌ Python Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
        // Delete the uploaded file (optional cleanup)
        fs.unlinkSync(filePath);

        if (code === 0) {
            res.send({ result: output });
        } else {
            res.status(500).send("Something went wrong.");
        }
    });
});

router.get("/upload", (req, res) => {
    res.render("users/upload"); // this assumes your EJS file is at views/users/upload.ejs
});

module.exports = router;
