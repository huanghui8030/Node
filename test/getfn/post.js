//post请求
var http = require('http');
var querystring = require('querystring');
var util = require('util');
http.createServer(function(req,res){
	var post = '';//定义一个post变量，用于暂存请求体的信息
	//通过req的data事件监听函数，每当接受到请求的数据，就累加到post变量中
	req.on('data',function(chunk){
		post += chunk;
	});
	//在end事件触发后，通过querystring.parse将post解析为真正的post请求格式，然后向客服端返回。
	req.on('end',function(){
		post = querystring.parse(post);
		res.end(util.inspect(post));
	});
}).listen(3000);