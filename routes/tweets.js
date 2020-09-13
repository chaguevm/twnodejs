const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const Tweet = require('../models/tweets');

router.post('/tweet', Tweet.create);

router.get('/tweets', Tweet.listAll);

router.get('/follow/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const follow = await pool.query(`INSERT INTO follows (user_follower, user_followed) VALUES (${req.user.id},${user_id})`);
    res.redirect(req.get('referer'));
});

router.get('/likes/:id', async (req, res) => {
    const { id } = req.params;
    const like = await pool.query(`INSERT INTO likes (tweet_id, user_id) VALUES (${id}, ${req.user.id})`);
    res.redirect(req.get('referer'));
});

router.post('/comment/:id', async (req, res) => {
    const { id } = req.params;
    const comment = await pool.query(`INSERT INTO comments (comment, tweetid, userid) VALUES ('${req.body.comment}', ${id}, ${req.user.id})`);
    res.redirect(req.get('referer'));
});

router.get('/hashtags', async (req, res) => {
    const hashtags = await pool.query(`SELECT * FROM hashtags ORDER BY id DESC LIMIT 10`);
    res.json(hashtags);
});


module.exports = router;