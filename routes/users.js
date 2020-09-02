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
    const query2 = `SELECT follows.*, u1.username AS follower, u1.fullname AS followername, u1.description AS followerdesc, u2.username AS followed, u2.fullname AS followedname, u2.description AS followeddesc FROM follows JOIN users AS u1 ON u1.id = user_follower JOIN users AS u2 ON u2.id = user_followed WHERE u2.username = '${username}'`;
    const followers = await pool.query(query2);
    res.render('stats', {stats: stats[0], statics: followers});
});

module.exports = router;