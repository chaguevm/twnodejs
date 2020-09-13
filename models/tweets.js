const { database } = require("../keys")
const pool = require('../database');

const Tweet = {}

//Nuevo Tweet
Tweet.create = async (req, res) => {
    const tw = req.body.tweet; //Recupera solo el Tweet de lo enviado por el usuario
    const regex = /[#]+([A-Za-z0-9-_]+)/gi;
    const matches = tw.match(regex);
    if (matches) {
        matches.forEach(async element => {
            //Consultar si el HT ya existe
            const exist = await pool.query(`SELECT * FROM hashtags WHERE hashtag = '${element}'`);
            if (exist.length === 0) {
                //Registrar el HT si no existe
                const ht = await pool.query(`INSERT INTO hashtags (hashtag) VALUES ('${element}') `);
            }
        });
    }

    const tweet = await pool.query('INSERT INTO tweets SET ? ', [req.body]);
    res.json({ code: 200, success: 'Tweet registrado' });
}

//Conseguir todos los tweets
Tweet.listAll = async (req, res) => {
    const user_id = req.user.id; //ID del usuario logueado
    //Query para obtener los tweet del usuario + los tweet de los siguiendo del usuario
    const query = `SELECT tweets.*, users.username, users.fullname, (SELECT COUNT(like_id) FROM likes WHERE tweet_id = tweets.id ) AS likes, ( SELECT CASE WHEN likes.user_id = users.id AND likes.tweet_id = tweets.id THEN 'true' ELSE 'false' END dolike FROM likes) as doLike FROM tweets JOIN users ON user_id = users.id WHERE users.id = ${user_id} OR user_id = (SELECT user_followed FROM follows WHERE user_follower = ${user_id}) ORDER BY tweets.id DESC`
    var tweets = await pool.query(query); //Se consultan todos los tweets  

    res.json({ code: 200, tweets});
}

//Conseguir los comentarios de un tweet
Tweet.getCommentFromPost = async (req, res) => {
    const { tweet_id } = req.params;
    const comments = await pool.query(`SELECT comments.*, users.username, users.fullname FROM comments JOIN users ON userid = users.id WHERE tweetid = ${tweet_id}`);

    res.json({code: 200, comments});
}

//Conseguir los tweets de un usuario consultado
Tweet.listByUsername = async (req, res) => {
    //Buscar el usuario
    const { username } = req.params;
    const user_id = req.user.id;

    //Conseguir todos los tweet del usuario
    const query = `SELECT tweets.*, users.username, users.fullname, (SELECT COUNT(like_id) FROM likes WHERE tweet_id = tweets.id ) AS likes, ( SELECT CASE WHEN likes.user_id = users.id AND likes.tweet_id = tweets.id THEN 'true' ELSE 'false' END dolike FROM likes) as doLike FROM tweets JOIN users ON user_id = users.id WHERE users.username = '${username}' ORDER BY tweets.id DESC `
    const tweets = await pool.query(query);

    res.json({ code: 200, tweets });
}
module.exports = Tweet;