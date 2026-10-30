const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
http.createServer((req,res)=>{const name=req.url.split('?')[0];const allowed={'/':'index.html','/index.html':'index.html','/style.css':'style.css','/app.js':'app.js'};const file=allowed[name];if(!file){res.writeHead(404);return res.end('Not found');}res.setHeader('Content-Type',types[path.extname(file)]);fs.createReadStream(path.join(__dirname,file)).pipe(res);}).listen(4187,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4187'));

