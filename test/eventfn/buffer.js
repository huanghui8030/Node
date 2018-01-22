//1.创建Buffer类
var buf1 = new  Buffer(20);//最大字节数
var buf2 = new Buffer([10,20,30,40,50]);
var buf3 = new Buffer('www.chsi.com.cn','utf-8');

//2.写入缓冲区
//buf.write(string[, offset[, length]][, encoding])
//string - 写入缓冲区的字符串。
//offset - 缓冲区开始写入的索引值，默认为 0 。
//length - 写入的字节数，默认为 buffer.length
//encoding - 使用的编码。默认为 'utf8' 
var len = buf1.write("hello world!");
console.log("写入字节数"+len);   //12

//3.从缓冲区读取数据
//buf.toString([encoding[, start[, end]]])
//encoding - 使用的编码。默认为 'utf8' 。
//start - 指定开始读取的索引位置，默认为 0。
//end - 结束位置，默认为缓冲区的末尾。
var buf = new Buffer(26);
for (var i =0; i <26; i++) {
	buf[i] = i +97;
}
console.log(buf.toString('utf8'));//abcdefghijklmnopqrstuvwxyz
console.log(buf.toString('ascii',0,5));//abcde
console.log(buf.toString('utf8',0,5));//abcde
console.log(buf.toString(undefined,0 ,5))//abcde

//4.将Buffer转换为JSON对象
var json = buf3.toJSON(buf3);
console.log(json);
//{ type: 'Buffer',data: [ 119, 119, 119, 46, 99, 104, 115, 105, 46, 99, 111, 109, 46, 99, 110 ] }

//5.缓冲区合并
//Buffer.concat(list[, totalLength])
//list - 用于合并的 Buffer 对象数组列表。
//totalLength - 指定合并后Buffer对象的总长度。
var buffer1 = new Buffer('学信网');
var buffer2 = new Buffer('www.chsi.com.cn');
var buffer3 = Buffer.concat([buffer1,buffer2]);
console.log("buffer3内容：" + buffer3.toString());//buffer3内容：学信网www.chsi.com.cn

//6.缓冲区比较
//buf.compare(otherBuffer); 
//otherBuffer - 与 buf 对象比较的另外一个 Buffer 对象。
var buffer4 = new Buffer('ABC');
var buffer5 = new Buffer('ABCD');
var result = buffer4.compare(buffer5);
if(result<0){
	console.log(buffer4 + "在" + buffer5 + "之前");
}else if (result==0) {
	console.log(buffer4 + "与" + buffer5 + "相同");
}else{
	console.log(buffer4 + "在" + buffer5 + "之后");
};
//ABC在ABCD之前

//7.拷贝缓冲区
//buf.copy(targetBuffer[, targetStart[, sourceStart[, sourceEnd]]])
//targetBuffer - 要拷贝的 Buffer 对象。
//targetStart - 数字, 可选, 默认: 0
//sourceStart - 数字, 可选, 默认: 0
//sourceEnd - 数字, 可选, 默认: buffer.length
var buffer6 = new Buffer('ABC');
var buffer7 = new Buffer(3);
buffer6.copy(buffer7);
console.log("buffer7 content:"+buffer7.toString());//ABC

//8.缓冲区裁剪
//buf.slice([start[, end]])
//start - 数字, 可选, 默认: 0
//nd - 数字, 可选, 默认: buffer.length
var buffer8 = new Buffer('chsi');
// 剪切缓冲区
var buffer9 = buffer8.slice(0,2);
console.log("buffer9 content: " + buffer9.toString());//ch

//9.缓冲区长度
//buf.length;
var buffer10 = new Buffer('www.chsi.com.cn');
//  缓冲区长度
console.log("buffer10 length: " + buffer10.length);//15






