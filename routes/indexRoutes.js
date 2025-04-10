const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

//routes
router.get('/home',indexController.homePage)


module.exports = router;
