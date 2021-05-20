const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated() && req.user.auth){ // verificacion de inicio de sesion y de validacion de email
        return next();
    }
    req.flash('error', 'No autorizado, valide su cuenta. Revise su casilla de correo electronico.');
    res.redirect('/users/signin');
};

module.exports = helpers;