var EE = require('events').EventEmitter;
var event = new EE;
event.on('some_event', function() {
	console.log('sonme_event 事件触发');
});
setTimeout(function(){
	event.emit('some_event');
},1000);