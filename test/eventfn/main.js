//引入events模块
var events = require('events');
//创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();

//创建事件处理程序
var connectHandler = function connected(){
	console.log('1连接成功。');
	//触发 data_received事件
	eventEmitter.emit('data_received');
};

//绑定connection事件处理程序
eventEmitter.on('connection',connectHandler);

//使用匿名函数绑定data_received事件
eventEmitter.on('data_received',function(){
	console.log('2数据接收成功。');
});

//触发 connection事件
eventEmitter.emit('connection');

console.log('3程序执行完毕。');
