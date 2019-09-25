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

const Passwd = require('./etc/passwd.json');

passport.use(new local.Strategy(
    { usernameField: 'login',
      passwordField: 'passwd' },
    (login, passwd, done)=>{
        if (! login) return done(null, false);
        let user = Passwd.find(u=>u.id == login && u.passwd == passwd);
        if (! user)  return done(null, false);
        user = { id: `${user.id}@local`, name: user.name, icon: user.icon };
        return done(null, user);
    }
));

passport.serializeUser((user, done)=>{
    done(null, JSON.stringify(user));
});
passport.deserializeUser((userstr, done)=>{
    done(null, JSON.parse(userstr));
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
//    console.log('session:', req.session);
//    console.log('user:', req.user);
    if(! req.user) res.redirect('/login');
    else           next();
});
app.use(express.static('./'));
app.use(index('./', {icons: true, view: 'details'}));
app.use((req, res)=>res.status(404).send('<h1>Not Found</h1>'))

app.listen(8000, ()=>console.log('Server listening on http://127.0.0.1:8000'));
