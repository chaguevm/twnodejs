const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => {
    const tweets = await pool.query('SELECT * FROM tweets JOIN users ON user_id = users.id ORDER BY tweets.id DESC');
    try {
        const user_id = req.user.id;
        const followers = await pool.query('SELECT COUNT(user_follower) as cant FROM follows WHERE user_followed = ?', [user_id]);
        const following = await pool.query('SELECT COUNT(user_followed) as cant FROM follows WHERE user_follower = ?', [user_id]);
        res.render('tweets', { tweets, followers: followers[0], following: following[0] });
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
        console.log('Usuario consultado');
        console.log(result);
        if (req.user.id === result.id) {
            isFollowing = true; //Es el mismo usuario
        } else {
            pool.query(`SELECT id FROM follows WHERE user_follower = ${req.user.id} AND user_followed = ${result.id}`, (err, result) => {
                if (err) throw err;
                if (result.length > 0)
                    isFollowing = true;
                else
                    isFollowing = false;
                console.log("Se siguen o no se siguen");
                console.log(result);
                const query = `SELECT (SELECT COUNT(user_follower) as cant FROM follows JOIN users ON user_followed = users.id WHERE users.username = '${username}' ) AS followers, (SELECT COUNT(user_followed) as cant FROM follows JOIN users ON user_follower = users.id WHERE users.username = '${username}' ) AS followings`;
                pool.query(query, (err, result) => {
                    if (err) throw err;
                    stats = result[0];
                    console.log("estadisticas");
                    console.log(stats);
                    pool.query(`SELECT * FROM tweets JOIN users ON user_id = users.id WHERE users.username = '${username}' ORDER BY tweets.id DESC `, (err, result) => {
                        if (err) throw err;
                        tweets = result;
                        console.log('tweets');
                        console.log(tweets);
                        res.render('usertweets', { tweets, _user: profile, stats });
                    });
                });
            });
        }
    }).catch(err => {
        throw err;
    });



    /*
    pool.query(`SELECT * FROM users WHERE username = '${username}'`, (err, result ) => {
        if (err) throw err;
        profile = result[0];
        /*pool.query(`SELECT id FROM follows WHERE user_follower = ${req.user.id} AND user_followed = ${profile.id}`, (err, result) => {
            if (err) throw err;
            isFollowing = result[0];
            
        //});
    });
    */

});

module.exports = router;