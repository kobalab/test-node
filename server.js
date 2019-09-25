/*!
 *  test-node/server
 */

"use strict";

const express = require('express');
const index   = require('serve-index');
const logger  = require('morgan');
const session = require('express-session');

const app = express();

app.use(logger('dev'));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static('./'));
app.use(index('./', {icons: true, view: 'details'}));
app.use((req, res)=>res.status(404).send('<h1>Not Found</h1>'))

app.listen(8000, ()=>console.log('Server listening on http://127.0.0.1:8000'));
