const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
// const validator = require('express-validator')
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')

//Funcionando!
const environment = process.env.NODE_ENV || 'development';    // if something else isn't setting ENV, use development
const knexSessionStore = require('connect-session-knex')(session);
// const knexPg = require('knex')({ //Criando nova connection with database
//   client: 'pg',
//   connection: {
//     host: 'localhost',
//     user: 'postgres',
//     password: '12300',
//     database: 'favoritelinks'
//   }
// });

//Utilizando a conexão atual com o banco de dados. Funcionando!
const db = require('./knexfile')
const knexPg = require('knex')(db[environment])

const store = new knexSessionStore({
  knex: knexPg,
  tablename: 'sessions'
})


// Intializations
const app = express();
//Passport module
require('./lib/passport');

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Method-override
app.use(methodOverride('_method'))

app.use(session({
  secret: 'secret',  
  resave: false,
  saveUninitialized: false,  
  store: store

}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// app.use(validator()); //Middleware express-validator

// Global variables
app.use((req, res, next) => {
  app.locals.message = req.flash('message');
  app.locals.success = req.flash('success');
  app.locals.user = req.user; //Armazenar os dados do usuário que estão guardados no session para dentro da var global user
  next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

// Public
//Middleware para acessar a pasta public de forma dinâmica. Assim é possível colocar apenas o caminho da pasta img, que está dentro da pasta public
/* <img src="/img/logo.png" alt="Logo Fazt" class="card-img-top mx-auto m-2 rounded-circle w-50"> */

app.use(express.static(path.join(__dirname, 'public')));

// Starting
app.listen(app.get('port'), () => {
  console.log('Server is in port', app.get('port'));
});

