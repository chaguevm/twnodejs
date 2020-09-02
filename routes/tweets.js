const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.post('/tweet', async (req,res) => {
    //console.log(req.body);
    const tweet = await pool.query('INSERT INTO tweets SET ? ',[req.body]);
    res.redirect('/');
});

module.exports = router;