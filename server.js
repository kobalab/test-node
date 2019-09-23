/*!
 *  test-node/server
 */

"use strict";

const express = require('express');
const app = express();
const server = app.listen(8000, ()=>{
    console.log('Server listening on http://127.0.0.1:8000')
});

app.get('/*', (req, res, next)=>{
    res.send('<h1>Hello, world.</h1>');
});
