module.exports = {
    isLoggedIn (req, res, next) {
        //req.isAuthenticated é um método de passport.
        // Então quando inicializamos o passport em nossas middlewares. 
        // Ex: app.use(passport.initialize());
        // app.use(passport.session());
        //Ele habilita vários métodos para o objeto req das middlewares do express
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    }
};