const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const Tweet = require('../models/tweets');

//Nuevo tweet
router.post('/tweet', isLoggedIn, Tweet.create);
//Listar los tweet del usuario logueado
router.get('/tweets', isLoggedIn, Tweet.listAll);
//Listar los tweet de un usuario consultado
router.get('/tweets/:username', isLoggedIn, Tweet.listByUsername);
//Dejar un comentario en un tweet
router.post('/comments/:id', isLoggedIn, Tweet.addCommentToPost);
//Consultar los comentarios de un tweet
router.get('/comments/:id', isLoggedIn, Tweet.getCommentFromPost);
//Dejar un like a un tweet
router.get('/like/:id', isLoggedIn, Tweet.like);
//Quitar el like a un tweet
router.delete('/unlike/:id', isLoggedIn, Tweet.unLike);
//Conseguir los ultimos 10 HT
router.get('/hashtags', isLoggedIn, Tweet.listHashtags);
//Consultar los tweet de un HT
router.get('/hashtags/:hashtag', isLoggedIn, Tweet.listTweetsFromHt);

module.exports = router;