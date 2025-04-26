const express = require("express");
const passport = require("passport");
const router = express.Router();
const userController = require("../controllers/userController");
const uploadController = require("../controllers/uploadController");
const { isLoggedIn } = require("../middlewares/isLoggedin");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Create upload directories if they don't exist
const createDirIfNotExists = (dirPath) => {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
};

const uploadsDir = path.join(__dirname, "../uploads");
const profileImagesDir = path.join(uploadsDir, "profileImages");
const resumesDir = path.join(uploadsDir, "resumes");

createDirIfNotExists(uploadsDir);
createDirIfNotExists(profileImagesDir);
createDirIfNotExists(resumesDir);

// Setup multer
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file.fieldname === "profileImage") {
			cb(null, profileImagesDir);
		} else if (file.fieldname === "resumeFile") {
			cb(null, resumesDir);
		} else {
			cb(new Error("Invalid field name for file upload"));
		}
	},
	filename: function (req, file, cb) {
		const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${
			file.originalname
		}`;
		cb(null, uniqueName);
	},
});

// File filter function
const fileFilter = (req, file, cb) => {
	if (file.fieldname === "profileImage") {
		// Allow only images for profile pictures
		if (file.mimetype.startsWith("image/")) {
			cb(null, true);
		} else {
			cb(
				new Error("Only image files are allowed for profile pictures"),
				false
			);
		}
	} else if (file.fieldname === "resumeFile") {
		// Allow PDFs, DOCs, and DOCXs for resumes
		const allowedTypes = [
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		];
		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(
				new Error(
					"Only PDF and Word documents are allowed for resumes"
				),
				false
			);
		}
	} else {
		cb(new Error("Invalid field name"), false);
	}
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB size limit
	},
});

// Registration
router.get("/register", userController.renderRegistration);
router.post(
	"/register",
	upload.fields([
		{ name: "profileImage", maxCount: 1 },
		{ name: "resumeFile", maxCount: 1 },
	]),
	userController.registerUserWithDetails
);

// File uploads for existing users
router.post(
	"/upload-profile",
	isLoggedIn,
	upload.single("profileImage"),
	uploadController.handleFileUpload
);

router.post(
	"/upload-resume",
	isLoggedIn,
	upload.single("resumeFile"),
	uploadController.handleFileUpload
);

// Authentication routes
router.get("/login", userController.renderLogin);
router.post(
	"/login",
	passport.authenticate("local", {
		failureRedirect: "/users/login",
		successRedirect: "/home",
	})
);
router.get("/profile", isLoggedIn, userController.getProfile);
router.get("/logout", isLoggedIn, userController.logoutUser);

module.exports = router;
