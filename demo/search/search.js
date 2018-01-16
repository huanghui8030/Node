/**
 * 找出所有的大于10KB的图片
 * huanghui 20171213
 */
var fs = require('fs');  
var path = require('path');  
  
 
var DirName = 'demo/'; //相对路径


init();

function init(){
    var filePath = path.resolve(DirName); 
    //调用文件遍历方法  
    fileDisplay(filePath);  
}
  
/** 
 * 文件遍历方法 
 * @param filePath 需要遍历的文件路径 
 */  
function fileDisplay(filePath){  
    //根据文件路径读取文件，返回文件列表  
    fs.readdir(filePath,function(err,files){  
        if(err){  
            console.warn(err)  
        }else{  
            //遍历读取到的文件列表  
            files.forEach(function(filename){  
                //获取当前文件的绝对路径  
                var filedir = path.join(filePath,filename);  
                //根据文件路径获取文件信息，返回一个fs.Stats对象  
                fs.stat(filedir,function(eror,stats){  
                    if(eror){  
                        console.warn('获取文件stats失败');  
                    }else{  
                        var isFile = stats.isFile();//是文件  
                        var isDir = stats.isDirectory();//是文件夹  
                        if(isFile){  
                            var txt = filename.substring(filename.lastIndexOf('.'));
                            if(['.png','.PNG','.jpg','.JPG','.svg','.SVG','.gif','.GIF','jpeg','JPEG'].indexOf(txt)>-1){
                                var newFilename = filedir.substring(filedir.indexOf(DirName),filedir.length);
                               
                                var filesize = (stats.size/1024).toFixed(2);
                                if(filesize>10){
                                     console.log(newFilename+'---大小：' +filesize+'KB'); 
                                }
                            }
                        }  
                        if(isDir){  
                            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件  
                        }  
                    }  
                })  
            });  
        }  
    });  
}  