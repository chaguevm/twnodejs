const router = require('express').Router();
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');


router.get('/edit/:username', isLoggedIn, (req, res) => {
    const { username } = req.params;
    if(username === req.user.username)
        res.render('auth/editprofile');
    else
        res.render('404');
});

router.post('/edit/:user_id', isLoggedIn, async (req, res) => {
    const { user_id } = req.params;
    const query = `UPDATE users SET username = '${req.body.username}', fullname = '${req.body.fullname}', description = '${req.body.description}' WHERE id = ${user_id}`;
    const user = await pool.query(query);
    res.redirect(`/profile/${req.body.username}`);
});

router.get('/followers/:username', isLoggedIn, async (req, res) => {
    const { username } = req.params;
    const query = `SELECT (SELECT COUNT(user_follower) as cant FROM follows WHERE user_followed = ${req.user.id}) as followers, (SELECT COUNT(user_followed) as cant FROM follows WHERE user_follower = ${req.user.id}) as following`;
    const stats = await pool.query(query);
    const query2 = `SELECT follows.*, u1.username, u1.fullname, u1.description FROM follows JOIN users AS u1 ON u1.id = user_follower JOIN users AS u2 ON u2.id = user_followed WHERE u2.username = '${username}'`;
    const followers = await pool.query(query2);
    res.render('search', {stats: stats[0], statics: followers});
});

router.get('/followings/:username', isLoggedIn, async (req, res) => {
    const { username } = req.params;
    const query = `SELECT (SELECT COUNT(user_follower) as cant FROM follows WHERE user_followed = ${req.user.id}) as followers, (SELECT COUNT(user_followed) as cant FROM follows WHERE user_follower = ${req.user.id}) as following`;
    const stats = await pool.query(query);
    const query2 = `SELECT follows.*, u2.username, u2.fullname, u2.description FROM follows JOIN users AS u1 ON u1.id = user_follower JOIN users AS u2 ON u2.id = user_followed WHERE u1.username = '${username}'`;
    const followeds = await pool.query(query2);
    res.render('search', {stats: stats[0], statics: followeds});
});

router.get('/recomendedusers/', isLoggedIn, async (req, res) => {
    const user_id = req.user.id;
    const usernotfolloweds = await pool.query(`SELECT users.id, users.username, users.fullname, users.description FROM users WHERE users.id NOT IN (SELECT follows.user_followed FROM follows WHERE user_follower = ${user_id}) AND users.id != ${user_id}`);
    res.json(usernotfolloweds);
});

module.exports = router;