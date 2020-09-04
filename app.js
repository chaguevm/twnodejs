const express = require ('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys');
const passport = require('passport');

//Inicialización
const app = express();
require('./lib/passport');

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
});

//Configuración
app.use(express.static('./public/'));
app.set('port', process.env.PORT || 3000); //puerto
app.set('views',path.join(__dirname, 'views')); //seteo de la ruta donde estan las vistas

//configuracion del motor de plantillas
app.engine('.hbs',exphbs({
    defaultLayout: 'main', //nombre del archivo principal
    layoutsDir: path.join(app.get('views'), 'layaouts'), //ubicacion de los layaouts
    partialsDir: path.join(app.get('views'), 'partials'), //ubicacion de los partials
    extname: '.hbs', //extension
    helpers: require('./lib/handlebars'), //auxiliares
})); 
app.set('view engine', '.hbs');


//Middleware
app.use(session({
    secret: 'linksappnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Variables Globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//rutas
app.use(require('./routes/'));
app.use(require('./routes/authentication'));
app.use(require('./routes/users'));
app.use(require('./routes/tweets'));

//Publico
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
    console.log('Servidor iniciado');
});

