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

//Login con custom Callback
//Se pasa el passport.authenticate dentro del manejador de la ruta, se pasa
//un callback al authentica para manejar el error y los mensajes personalizados,
//se usa el req.logIn para validar la respuesta y generar el req.user
router.post('/login' , isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.login', (err, user, flash) => {
        if(err)
            next(err); //Si hay un error en la ejecucion o con la DB
        if(!user)
            return res.json({code: 401, message: flash}); //Retorna el error en caso de tener un error con el usuario o la contraseña
        req.logIn(user, (err) => { 
            if (err) 
                next(err); //error en la ejecución
            return res.json({code: 200, success: flash}); //Retorna el code 200 y el mensaje de logueado
        });
    })(req, res, next);
    //console.log(response);
});

//Cerrar sesion
router.get('/logout', isLoggedIn,(req, res) => {
    req.logOut();
    res.json({code: 200, success: 'Logout'});
});

module.exports = router;