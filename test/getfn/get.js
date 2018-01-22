//获取get请求内容
var http = require('http');
var url = require('url');
var util = require('util');

http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(util.inspect(url.parse(req.url, true)));
}).listen(3000);

//url：http://127.0.0.1:3000/user?name=w3c&email=www.chsi.com.cn
//返回数据：
/*Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: '?name=w3c&email=www.chsi.com.cn',
  query: { name: 'w3c', email: 'www.chsi.com.cn' },
  pathname: '/user',
  path: '/user?name=w3c&email=www.chsi.com.cn',
*/

