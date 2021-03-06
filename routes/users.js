const router = require('express').Router();
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const User = require('../models/users');

//Conseguir info del usuario
router.get('/user/:username?', isLoggedIn, User.get);
//Editar usuario
router.post('/edit/:user_id', isLoggedIn, User.edit);
//Seguidores
router.get('/followers/:username', isLoggedIn, User.followers);
//Siguiendo
router.get('/followings/:username', isLoggedIn, User.followings);
//Usuarios recomendados
router.get('/recomendedusers/', isLoggedIn, User.recommendedUsers);
//Buscar un usuario
router.post('/search', User.search);
//Conocer si se puede seguir o ya se sigue al usuario
router.get('/canFollow/:followed', isLoggedIn, User.canFollow);
//Hacer follow
router.get('/follow/:user_id', isLoggedIn, User.follow);
//Hacer unFollow
router.get('/unfollow/:user_id', isLoggedIn, User.unfollow);

module.exports = router;