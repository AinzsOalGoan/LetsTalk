const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { isLoggedIn } = require('../middlewares/isLoggedIn.js');
const { upload, handleFileUpload } = require("../utils/cloudinary.js");

//register
router.get('/register', userController.renderRegister)
      .post('/register', userController.registerUser);

// Render Login Form
router.get('/login', userController.renderLogin)
      .post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    successRedirect: '/home',
}));

// Logout Route
router.get('/logout',isLoggedIn, userController.logoutUser);

// Route for uploading a single file (e.g., profile image) [use this as you wish]
// router.post("/upload", upload.single("profileImage"), handleFileUpload);

//profilr routes
// router.get('/profile',isLoggedIn,userController.seeProfile)


module.exports = router;
