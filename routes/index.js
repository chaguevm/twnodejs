const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    const user_id = req.user.id;
    const query = `SELECT tweets.*, users.username, users.fullname, (SELECT COUNT(like_id) FROM likes WHERE tweet_id = tweets.id ) AS likes, ( SELECT CASE WHEN likes.user_id = users.id AND likes.tweet_id = tweets.id THEN 'true' ELSE 'false' END dolike FROM likes) as doLike FROM tweets JOIN users ON user_id = users.id WHERE users.id = ${user_id} OR user_id = (SELECT user_followed FROM follows WHERE user_follower = ${user_id}) ORDER BY tweets.id DESC`
    tweets = await pool.query(query);

    tweets.forEach( async (element, index) => {
        const comments = await pool.query(`SELECT comments.*, users.username, users.fullname FROM comments JOIN users ON userid = users.id WHERE tweetid = ${element.id}`);
        tweets[index].comments = comments;
    });

    const usernotfolloweds = await pool.query(`SELECT users.id, users.username, users.fullname, users.description FROM users WHERE users.id NOT IN (SELECT follows.user_followed FROM follows WHERE user_follower = ${user_id}) AND users.id != ${user_id}`);
    try {
        const query = `SELECT (SELECT COUNT(user_follower) as cant FROM follows WHERE user_followed = ${user_id}) as followers, (SELECT COUNT(user_followed) as cant FROM follows WHERE user_follower = ${user_id}) as following`;
        const stats = await pool.query(query);
        res.render('tweets', { tweets, stats: stats[0], usernotfolloweds });
    } catch (error) {
        console.error(err);
    }
});

function getUser(username) {
    return new Promise((res, rej) => {
        pool.query(`SELECT * FROM users WHERE username = '${username}'`, (err, result) => {
            if (err)
                return rej(err);
            res(result[0]);
        });
    });
}

router.get('/profile/:username', isLoggedIn, (req, res) => {
    const { username } = req.params;
    let profile, isFollowing, stats, tweets;

    getUser(username).then((result) => {
        profile = result;
        if (profile !== undefined) {
            //Comprobar si el usuario logueado sigue al usuario que intenta consultar
            pool.query(`SELECT id FROM follows WHERE user_follower = ${req.user.id} AND user_followed = ${result.id}`, (err, result) => {
                if (err) throw err;
                if (req.user.id === profile.id)
                    isFollowing = true;
                else if (result.length > 0)
                    isFollowing = true;
                else
                    isFollowing = false;
                const query = `SELECT (SELECT COUNT(user_follower) as cant FROM follows JOIN users ON user_followed = users.id WHERE users.username = '${username}' ) AS followers, (SELECT COUNT(user_followed) as cant FROM follows JOIN users ON user_follower = users.id WHERE users.username = '${username}' ) AS followings`;
                pool.query(query, (err, result) => {
                    if (err) throw err;
                    stats = result[0];
                    pool.query(`SELECT tweets.*, users.username, users.fullname, (SELECT COUNT(like_id) FROM likes WHERE tweet_id = tweets.id ) AS likes, ( SELECT CASE WHEN likes.user_id = users.id AND likes.tweet_id = tweets.id THEN 'true' ELSE 'false' END dolike FROM likes) as doLike FROM tweets JOIN users ON user_id = users.id WHERE users.username = '${username}' ORDER BY tweets.id DESC `, (err, result) => {
                        if (err) throw err;
                        tweets = result;
                        res.render('usertweets', { tweets, _user: profile, stats, isFollowing });
                    });
                });
            });
        } else {
            res.render('404');
        }
    }).catch(err => {
        throw err;
    });
});

router.post('/search', async (req, res) => {
    const { search } = req.body;
    const query = `SELECT (SELECT COUNT(user_follower) as cant FROM follows WHERE user_followed = ${req.user.id}) as followers, (SELECT COUNT(user_followed) as cant FROM follows WHERE user_follower = ${req.user.id}) as following`;
    const stats = await pool.query(query);
    const users = await pool.query(`SELECT * FROM users WHERE username LIKE '%${search}%'`);
    console.log(users);
    res.render('search', { stats: stats[0], statics: users })
});

module.exports = router;