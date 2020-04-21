const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const knex = require('../data/db')

const helpers = require('./helpers');

// passport.use('local.signin', new LocalStrategy({
//   usernameField: 'username',
//   passwordField: 'password',
//   passReqToCallback: true
// }, async (req, username, password, done) => {
//   const rows = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
//   if (rows.length > 0) {
//     const user = rows[0];
//     const validPassword = await helpers.matchPassword(password, user.password)
//     if (validPassword) {
//       done(null, user, req.flash('success', 'Welcome ' + user.username));
//     } else {
//       done(null, false, req.flash('message', 'Incorrect Password'));
//     }
//   } else {
//     return done(null, false, req.flash('message', 'The Username does not exists.'));
//   }
// }));

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await knex('users').where('username', username) //Retornar todos os usuários que possuem o username igual o username digitado no formulário
  console.log('users: ', rows)
  console.log('req.body: ', req.body)
  if(rows.length > 0) { //Encontrou 1 ou + usuários
    const user = rows[0];
    //password - senha informada no formulário
    //user.password - senha do usuário
    const validPassword = await helpers.matchPassword(password, user.password)
    if(validPassword) {
      done(null, user, req.flash('Welcome Brow'))
    } else {
      done(null, false, req.flash('Incorrect Password'))
    }
  } else { //Não encontrou nenhum usuário
    done(null, false, req.flash('The Username does not exists'))
  }
}
))


//Signup Funcionando!
passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

  const { fullname } = req.body;

  let newUser = {
    fullname,
    username,
    password
  };
  newUser.password = await helpers.encryptPassword(password); //Criptografar senha

  const user = await knex('users').insert(newUser).returning('*') //capturar user atual do form signup
  console.log('Response: ', user[0]) 
  newUser.id = user[0].id; //Passar id do user atual para a prop newUser.id
  return done(null, newUser);
}));

passport.serializeUser((user, done) => {
  done(null, user.id); //user.id serve para guardar o id do usuário dentro da session
});

passport.deserializeUser(async (id, done) => {
  const rows = await knex('users').where('id', id) //Consultar banco de dados para verificar se o user.id acima existe
  done(null, rows[0]);
});

