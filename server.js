/*!
 *  test-node/server
 */

"use strict";

const http = require('http');

http.createServer((req, res)=>{
    res.writeHead(200);
    res.write('<h1>Hello, world.</h1>');
    res.end();
}).listen(8000);
