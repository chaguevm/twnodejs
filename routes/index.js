const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const User = require('../models/users');

router.get('/', isLoggedIn, (req, res) => {
    res.render('tweets');
});

module.exports = router;