const express = require('express');
const router = express.Router();
// imported two methods from controllers folder which has our auth logic  
const { signup, signin } = require('../controllers/auth');

// we define two endpoints signin and signup
router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;