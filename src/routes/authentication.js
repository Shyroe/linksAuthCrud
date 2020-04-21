const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

// SIGNUP
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

// SINGIN
router.get('/signin', (req, res) => {
    res.render('auth/signin');
  });

// Profile
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
  });

  //Criar conta(usuário)
    router.post('/signup', passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    //Utilizando (req, res)
    // router.post('/signup', (req, res) => {
    //     passport.authenticate('local.signup', {
    //     successRedirect: '/profile',
    //     failureRedirect: '/signup',
    //     failureFlash: true
    //      });
    // res.send('received')
    // });

//Utilizando Express validator Middleware
// Acessar conta(usuário)
// router.post('/signin', (req, res, next) => {
//     req.check('username', 'Username is Required').notEmpty();
//     req.check('password', 'Password is Required').notEmpty();
//     const errors = req.validationErrors();
//     if (errors.length > 0) {
//       req.flash('message', errors[0].msg);
//       res.redirect('/signin');
//     }
//     passport.authenticate('local.signin', {
//       successRedirect: '/profile',
//       failureRedirect: '/signin',
//       failureFlash: true
//     })(req, res, next);
//   });

//Funcionando!
router.post('/signin', (req, res, next) => {
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
})(req, res, next)
})

  //Logout
  router.get('/logout', (req, res) => {
    req.logOut(); //Este método existe no passport. Ele serve para encerrar session
    res.redirect('/');
  });


  module.exports = router;

