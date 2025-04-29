const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const { isLoggedIn } = require('../middlewares/isLoggedin'); // your auth middleware


//render recruiter form
router.get('/register', isLoggedIn, recruiterController.renderRecruiterForm);

// POST or PUT Recruiter Profile
router.post('/profile', isLoggedIn, recruiterController.createOrUpdateRecruiter);

// GET Recruiter Profile
router.get('/getprofile', isLoggedIn, recruiterController.getRecruiterProfile);

module.exports = router;
