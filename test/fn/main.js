/**
	Node.js函数
	在JavaScript中，一个函数可以作为另一个函数接收一个参数。我们可以先定义一个函数，然后传递，也可以在传递参数的地方直接定义函数。
	Node.js中函数的使用与Javascript类似，举例来说，你可以这样做
	
**/

function say(word){
	console.log(word);
}

function execute(someFunction,value){
	someFunction(value);
}

execute(say,'Node.js函数：hello');

/**
	匿名函数
	我们可以把一个函数作为变量传递。但是我们不一定要绕这个"先定义，再传递"的圈子，
	我们可以直接在另一个函数的括号中定义和传递这个函数：
**/
function execute1(someFn,value){
	someFn(value);
};
execute1(function(word){console.log(word);},'匿名函数：hello1');

/**
	函数传递是如何让HTTP服务器工作的
	浏览器访问：http://127.0.0.1:8888/
**/

// var http = require('http');
// http.createServer(function(request,response){
// 	response.writeHead(200,{'Content-Type':'text/plain'});
// 	response.write('Hello World!---3');
// 	response.end();
// }).listen(8888);

//以下方法也可行。（ps：需要注释上面的代码，不能同时开启两个服务器。）
 var http1 = require('http');
 function onRequest(request,response){
 	response.writeHead(200,{'Content-Type':'text/plain'});
 	response.write('Hello Wrold!--4');
 	response.end();
 }
 http1.createServer(onRequest).listen(8081);
