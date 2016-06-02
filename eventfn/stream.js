/**
 * Stream 有四种流类型： Readable - 可读操作。 Writable - 可写操作。 Duplex - 可读可写操作. Transform - 操作被写入数据，然后读出结果。
  常用事件：data、end、error、finish（所有数据已被写入到底层系统时触发）
 **/
//1.从流中读取数据 createReadStream
var fs = require('fs');
var data = '';
//创建可度流
var readerStream = fs.createReadStream('input.txt');
//设置编码为utf8
readerStream.setEncoding('UTF8');
//处理流事件-》data，end，and error
readerStream.on('data',function(chunk){
	data += chunk;
});
readerStream.on('end',function(){
	console.log(data);
});
readerStream.on('error',function(err){
	console.log(err.stack);
});
console.log('输入流-程序执行完毕！');


//2.写入流 createWriteStream
var fs2 = require("fs");
var data2 = '菜鸟教程官网地址：www.runoob.com';
// 创建一个可以写入的流，写入到文件 output.txt 中
var writerStream = fs2.createWriteStream('output.txt');
// 使用 utf8 编码写入数据
writerStream.write(data2,'UTF8');
// 标记文件末尾
writerStream.end();
// 处理流事件 --> data, end, and error
writerStream.on('finish', function() {
    console.log("写入完成。");
});
writerStream.on('error', function(err){
   console.log(err.stack);
});
console.log("写入流-程序执行完毕");

//3.管道流
var fs3 = require("fs");
// 创建一个可读流
var readerStream3 = fs3.createReadStream('input.txt');
// 创建一个可写流
var writerStream3 = fs3.createWriteStream('output.txt');
// 管道读写操作
// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
readerStream3.pipe(writerStream3);
console.log("管道流-程序执行完毕");

//4.链式流
var fs4 = require("fs");
var zlib = require('zlib');
// 压缩 input.txt 文件为 input.txt.gz
fs4.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs4.createWriteStream('input.txt.gz'));
console.log("文件压缩完成。");


