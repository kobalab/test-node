/*!
 *  test-node/server
 */

"use strict";

const express = require('express');
const app = express();
const server = app.listen(8000);

app.get('/*', (req, res, next)=>{
    res.send('<h1>Hello, world.</h1>');
});
