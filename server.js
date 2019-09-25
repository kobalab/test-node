/*!
 *  test-node/server
 */

"use strict";

const express = require('express');
const index   = require('serve-index');
const logger  = require('morgan');
const session = require('express-session');
const parser  = require('body-parser');

const passport = require('passport');
const local    = require('passport-local');

passport.use(new local.Strategy((username, password, done)=>{
    let user = {id: `${username}@local`};
    if (username && password) return done(null, user);
    else return done(null, false);
}));

passport.serializeUser((user, done)=>{
    done(null, user.id);
});
passport.deserializeUser((id, done)=>{
    done(null, {id: id});
});

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(logger('dev'));
app.use(session({secret:'secret', resave:false, saveUninitialized:false}));
app.use(parser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/login', (req, res, next)=>res.render('login'));
app.post('/login',
    passport.authenticate('local', { successRedirect: '/',
                                     failureRedirect: '/login' })
);
app.use((req, res, next) =>{
    if(! req.user) res.redirect('/login');
    else           next();
});
app.use(express.static('./'));
app.use(index('./', {icons: true, view: 'details'}));
app.use((req, res)=>res.status(404).send('<h1>Not Found</h1>'))

app.listen(8000, ()=>console.log('Server listening on http://127.0.0.1:8000'));
