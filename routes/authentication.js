const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

//Registro de usuario
router.post('/signup' , isNotLoggedIn, passport.authenticate('local.signup',{
    failureRedirect: '/signup',
    failureFlash: true
}), (req, res) => {
    res.json({code: 200, success: 'Registered'});
});

//Login de usuario
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.login', (err, user, flash) => {
        if(err)
            return next(err); //Si hay error sigue con el error
        if(!user)
            return res.json({code: 404, message: flash}); //Si el usuario o la clave son incorrectas rectorna 404 con el mensaje de error
        return res.json({code: 200, success: flash}); //Si el usuario y pass son correctos da codigo 200 y mensaje de bienvenida
    })(req, res, next);
});

//Cerrar sesion
router.get('/logout', isLoggedIn,(req, res) => {
    req.logOut();
    res.json({code: 200, success: 'Logout'});
});

module.exports = router;