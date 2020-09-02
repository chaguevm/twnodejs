const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.post('/tweet', async (req,res) => {
    //console.log(req.body);
    const tweet = await pool.query('INSERT INTO tweets SET ? ',[req.body]);
    res.redirect('/');
});

router.get('/follow/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const follow = await pool.query(`INSERT INTO follows (user_follower, user_followed) VALUES (${req.user.id},${user_id})`);
    res.redirect(req.get('referer'));
});

module.exports = router;