/*  
 *  EventEmitter 提供了多个属性，如 on 和 emit。
 *  on 函数用于绑定事件函数，emit 属性用于触发一个事件
 */
var events = require('events');
var emitter = new events.EventEmitter();
emitter.on('someEvent', function(arg1,arg2) {
	console.log('事件监听1','arg1','arg2');
});
emitter.on('someEvent', function(arg3,arg4) {
	console.log('事件监听2','arg3','arg4');
});
emitter.emit('someEvent','arg1 参数','arg2 参数');

/*
 * EventEmitter 其他属性
 序号	方法 & 描述
1	addListener(event, listener)
为指定事件添加一个监听器到监听器数组的尾部。
2	on(event, listener)
为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数。
server.on('connection', function (stream) {
  console.log('someone connected!');
});
3	once(event, listener)
为指定事件注册一个单次监听器，即 监听器最多只会触发一次，触发后立刻解除该监听器。
server.once('connection', function (stream) {
  console.log('Ah, we have our first user!');
});
4	removeListener(event, listener)
移除指定事件的某个监听器，监听器 必须是该事件已经注册过的监听器。
var callback = function(stream) {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
 5	removeAllListeners([event])
移除所有事件的所有监听器， 如果指定事件，则移除指定事件的所有监听器。
6	setMaxListeners(n)
默认情况下， EventEmitters 如果你添加的监听器超过 10 个就会输出警告信息。 setMaxListeners 函数用于提高监听器的默认限制的数量。
7	listeners(event)
返回指定事件的监听器数组。
8	emit(event, [arg1], [arg2], [...])
按参数的顺序执行每个监听器，如果事件有注册监听返回 true，否则返回 false。

 */
 