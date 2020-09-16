const { database } = require("../keys")
const pool = require('../database');
const passport = require('passport');
const User = {}


//Editar usuario
User.edit = async (req, res) => {
    const { user_id } = req.params;
    const query = `UPDATE users SET username = '${req.body.username}', fullname = '${req.body.fullname}', description = '${req.body.description}' WHERE id = ${user_id}`;
    const user = await pool.query(query);
    res.json({code: 200, success: "User edited"});
}

//Buscar todos los usuarios que coincidan con la busqueda
//Criterio de busqueda, username o fullname
User.search = async (req, res) => {
    const { search } = req.body;
    const users = await pool.query(`SELECT * FROM users WHERE username LIKE '%${search}%' OR fullname LIKE '%${search}%'`);
    res.json({code: 200, users});
}

//Seguir a un usuario
User.follow = async (req, res) => {
    const { user_id } = req.params;
    const follow = await pool.query(`INSERT INTO follows (user_follower, user_followed) VALUES (${req.user.id},${user_id})`);
    res.json({code: 200, success: "Follow"});
}

//Dejar de seguir a un usuario
User.unfollow = async (req, res) => {
    const { user_id } = req.params;
    const follow = await pool.query(`DELETE FROM follows WHERE user_follower = ${req.user.id} AND user_followed = ${user_id}`);
    res.json({code: 200, success: "UnFollow"});
}

//Lista los seguidores del usuario logueado
User.followers = async (req, res) => {
    const { username } = req.params;
    const query = `SELECT follows.*, u1.username, u1.fullname, u1.description FROM follows JOIN users AS u1 ON u1.id = user_follower JOIN users AS u2 ON u2.id = user_followed WHERE u2.username = '${username}'`;
    const followers = await pool.query(query);
    res.json({code: 200, followers});
}

//Lista los usuarios seguidos por el usuario logueado
User.followings = async (req, res) => {
    const { username } = req.params;
    const query = `SELECT follows.*, u2.username, u2.fullname, u2.description FROM follows JOIN users AS u1 ON u1.id = user_follower JOIN users AS u2 ON u2.id = user_followed WHERE u1.username = '${username}'`;
    const followings = await pool.query(query);
    res.json({code: 200, followings});
}

//Lista los usuarios recomendados
User.recommendedUsers = async (req, res) => {
    const user_id = req.user.id;
    const usernotfolloweds = await pool.query(`SELECT users.id, users.username, users.fullname, users.description FROM users WHERE users.id NOT IN (SELECT follows.user_followed FROM follows WHERE user_follower = ${user_id}) AND users.id != ${user_id}`);
    res.json(usernotfolloweds);
}

module.exports = User;