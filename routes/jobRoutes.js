const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { isLoggedIn } = require('../middlewares/isLoggedin');

router.get('/create', isLoggedIn, jobController.renderJobForm);
router.post('/create', isLoggedIn, jobController.createJobWithRounds);

module.exports = router;
