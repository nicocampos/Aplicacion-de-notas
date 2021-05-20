const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');
const transporter = require('../config/mailer');
const crypto = require('crypto');
const base64url = require('base64url');

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if(name.length <= 0){
        errors.push({text: 'El nombre no puede estar vacio'});
    }
    if(password != confirm_password){
        errors.push({text: 'Las contraseñas no coinciden'});
    }
    if(password.length < 4){
        errors.push({text: 'La contraseña debe tener mas de 4 caracteres'});
    }
    if(errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password});
    }
    else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error', 'El email ya esta en uso');
            res.redirect('/users/signup');
        }else{
        const codeAuth = await base64url(crypto.randomBytes(10)); // Genero un codigo de autenticacion
        const auth = false;
        const newUser = new User({name, email, password, codeAuth, auth});
        try {
            newUser.password = await newUser.encryptPassword(password);    
        } catch (error) {
            console.error(error);
        }        
        newUser.codeAuth = codeAuth;
        await newUser.save();
        await transporter.sendMail({
            from: 'Verificación de Notes App <developernicoc@gmail.com>',
            to: newUser.email,
            subject: 'Verificación de cuenta',
            html: `
            <div><b>Su codigo de verificación es: ${newUser.codeAuth}</b></div>
            <div><b>Ingrese al siguiente link para verificar su cuenta.</b></div>
            <a href="https://notas-nc.herokuapp.com/users/authentication">VERIFICAR</a>
            `
        })
        req.flash('success_msg', 'Estas registrado. Se le envio un mail de verificación');
        res.redirect('/users/authentication');
        }
    }
});

router.get('/users/authentication', (req, res) => {
    res.render('users/auth');
});

router.post('/users/authentication', async (req, res) => {
    const { email, codeAuth } = req.body;
    const newUser = await User.findOne({email: email});
    const errors = [];
    if(email.length <= 0){
        errors.push({text: 'El email no puede estar vacio.'});
    }
    if(codeAuth.length <= 0){
        errors.push({text: 'Se necesita un codigo de verificación.'});
    }
    if(codeAuth != newUser.codeAuth){
        errors.push({text: 'Se necesita un codigo de verificación valido.'});
    }
    if(errors.length > 0){
        res.render('users/auth', {email, codeAuth});
    }else{
        newUser.auth = true;
        await newUser.save();
        req.flash('success_msg', 'Su cuenta fue validada satisfatoriamente.')
        res.redirect('/users/signin');
    }
});

router.get('/users/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;