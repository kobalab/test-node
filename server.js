/*!
 *  test-node/server
 */

"use strict";

const express = require('express');
const index   = require('serve-index');
const logger  = require('morgan');
const session = require('express-session');
const parser  = require('body-parser');
const flash   = require('connect-flash');

const passport = require('passport');
const local    = require('passport-local');
const hatena   = require('passport-hatena');

const Passwd = require('./etc/passwd.json');

passport.serializeUser((user, done)=>{
    done(null, JSON.stringify(user));
});
passport.deserializeUser((userstr, done)=>{
    done(null, JSON.parse(userstr));
});

passport.use(new local.Strategy(
    { usernameField: 'login',
      passwordField: 'passwd' },
    (login, passwd, done)=>{
        let user = Passwd.find(u=>u.id == login && u.passwd == passwd);
        if (! user)  return done(null, false, { message: '認証エラー'});
        user = { id: `${user.id}@local`, name: user.name, icon: user.icon };
        return done(null, user);
    }
));

passport.use(new hatena.Strategy(
    require('./etc/hatena.json'),
    (token, tokenSecret, profile, cb)=>{
        let user = {
            id:   profile.id + '@hatena',
            name: profile.displayName,
            icon: profile.photos[0].value
        };
        cb(null, user);
    }
));


const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(logger('dev'));
app.use(flash());
app.use(session({secret:'secret', resave:false, saveUninitialized:false}));
app.use(parser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/login', (req, res, next)=>{
    if (req.user) {
        req.flash();
        res.render('user', req.user);
    }
    else {
        let {login, error} = req.flash();
        res.render('login', {login: login && login[0], error: error});
    }
});
app.post('/login',
    (req, res, next)=>{
        req.flash('login', req.body.login);
        if (! req.body.login) {
            req.flash('error', 'Usernameが未入力');
            res.redirect('/login');
        }
        else if (! req.body.passwd) {
            req.flash('error', 'Passwordが未入力');
            res.redirect('/login');
        }
        else next();
    },
    passport.authenticate('local', { successRedirect: '/login',
                                     failureRedirect: '/login',
                                     failureFlash:    true      })
);
app.post('/login/hatena',
    passport.authenticate('hatena', { scope: ['read_public'] }));
app.get ('/login/hatena',
    passport.authenticate('hatena', { successRedirect: '/login',
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
