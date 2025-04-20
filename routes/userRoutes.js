const express = require("express");
const passport = require("passport");
const router = express.Router();
const userController = require("../controllers/userController");
const { isLoggedIn } = require("../middlewares/isLoggedin");
const multer = require("multer");

// Setup multer
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		if (file.fieldname === "profileImage") cb(null, "uploads/profileImages/");
		else if (file.fieldname === "resumeFile") cb(null, "uploads/resumes/");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname);
	}
});

const upload = multer({ storage });

router.get("/register", userController.renderRegistration);

router.post(
	"/register",
	upload.fields([
		{ name: "profileImage", maxCount: 1 },
		{ name: "resumeFile", maxCount: 1 }
	]),
	userController.registerUserWithDetails
);

router.get("/login", userController.renderLogin);

router.post("/login", passport.authenticate("local", {
	failureRedirect: "/users/login",
	successRedirect: "/home"
}));

router.get('/profile', isLoggedIn, userController.getProfile);

router.get("/logout", isLoggedIn, userController.logoutUser);

module.exports = router;
