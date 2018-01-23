
var fs = require("fs"),
    path = require("path");

/**
 * 删除某一个包下面的需要符合格式的文件。
 * @param  {String} url  文件路径，绝对路径
 * @param  {String} name 需要删除的文件名称
 * @return {Null}   
 * @author huangh 20170123
 */
function deleteFile(url,name){
    var files = [];
    
    if( fs.existsSync(url) ) {    //判断给定的路径是否存在
       
        files = fs.readdirSync(url);    //返回文件和子目录的数组

        files.forEach(function(file,index){

            var curPath = path.join(url,file);

            if(fs.statSync(curPath).isDirectory()) { //同步读取文件夹文件，如果是文件夹，则函数回调
                deleteFile(curPath,name);
            } else {   
               
                if(file.indexOf(name)>-1){    //是指定文件，则删除
                    fs.unlinkSync(curPath);
                    console.log("删除文件："+curPath);
                }
            }  
        });
    }else{
        console.log("给定的路径不存在！");
    }

}

deleteFile('/Users/huanghui/Documents/Nodejs/test/deletefile/test/','deletefile');
