/*!
 *  test-node/server
 */

"use strict";

const express = require('express');
const session = require('express-session')({
                            secret:'secret',
                            resave:false,
                            saveUninitialized:false });
const flash   = require('connect-flash');
const index   = require('serve-index');
const logger  = require('morgan');

const passport = require('./lib/passport');

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(logger('dev'));
app.use(flash());
app.use(session);
app.use(express.urlencoded({extended: false}));

app.use(passport.initialize());
app.use(passport.session());
app.get('/login', (req, res, next)=>{
    if (req.user) res.render('user',  req.user)
    else          res.render('login', req.flash())});
app.post('/login',
    passport.authenticate('local', { successRedirect: '/login',
                                     failureRedirect: '/login',
                                     failureFlash:    '認証エラー' }));
app.post('/login/hatena',
    passport.authenticate('hatena', { scope: ['read_public'] }));
app.get ('/login/hatena',
    passport.authenticate('hatena', { successRedirect: '/login',
                                      failureRedirect: '/login' }));
app.use((req, res, next)=>{
    if(! req.user) res.redirect('/login')
    else           next() });

app.use(express.static('./'));
app.use(index('./', {icons: true, view: 'details'}));
app.use((req, res)=>res.status(404).send('<h1>Not Found</h1>'));

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const socket_io_session = require('socket.io-session')(session, passport);

io.use(socket_io_session.express_session);
io.use(socket_io_session.passport_initialize);
io.use(socket_io_session.passport_session);

io.on('connection', socket=>{
    console.log(socket.request.user)
    socket.on('hello', msg=>{
        console.log(socket.request.user);
        console.log('hello', msg);
    });
});

server.listen(8000,
    ()=>console.log('Server listening on http://127.0.0.1:8000'));
