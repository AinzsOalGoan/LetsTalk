const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controllers/userController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');


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

//profilr routes
router.get('/profile',isLoggedIn,userController.seeProfile)


module.exports = router;
