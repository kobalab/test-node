/*!
 *  test-node/server
 */

"use strict";

const express = require('express');
const index   = require('serve-index');

const app = express();

app.use(express.static('./'));
app.use(index('./', {icons: true, view: 'details'}));

const server = app.listen(8000, ()=>{
    console.log('Server listening on http://127.0.0.1:8000')
});
