var fs= require("fs");
//读取文件
fs.readFile('file/file.txt',{flag:'r+',encoding:'utf-8'},function(err,data){
    if(err){
        console.log("bad")
    }else{
        console.log("ok");
        console.log(data.toString());
    }
})

//写入文件，a表示追加，w写入，r只读
var data = "追加内容！";
fs.writeFile('file/file.txt',data,{flag:'a',encoding:'utf-8',mode:'0666'},function(err){
     if(err){
         console.log("文件写入失败")
     }else{
        console.log("文件写入成功");
     }
}) 