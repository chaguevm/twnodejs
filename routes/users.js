const router = require('express').Router();
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const User = require('../models/users');

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

module.exports = router;