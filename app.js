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
const cors = require('cors');

//Inicialización
const app = express();
require('./lib/passport');

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper('tw', function(v) {
    const regex = /[#]+([A-Za-z0-9-_]+)/gi;
    const match = v.match(regex);
    if(match){
        match.forEach(ht => {

            const nht = `<a href='/hashtags/${ht.replace('#','')}'>${ht}</a>`;
            v = v.replace(ht, nht);
        });
    }
    return v;
});

//Configuración
app.set('port', process.env.PORT || 3000); //puerto
app.set('views',path.join(__dirname, 'views')); //seteo de la ruta donde estan las vistas
//app.use(cors({credentials: true, origin: 'http://localhost:8080'}));

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
    cookie: { sameSite: 'none', secure: true },
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});

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

