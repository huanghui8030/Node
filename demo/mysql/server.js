/**
 * nodejs 实现数据的增删查改，链接mysql数据库
 * huangh  20171026
 */
var httpserver = require("http") ,
    qs = require("querystring") ,
    url = require("url") ,
    fs = require("fs")
    mysql = require("mysql");



var FileJson = "data.json";//写入内容的文件

//创建连接  
var Client = mysql.createConnection({  
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database:'mysql',
    port: 3306 
}); 



Client.connect();

httpserver.createServer(onRequest).listen(3000);


console.log('-------服务器已启动，请在浏览器中输入：http://127.0.0.1:3000/');

function onRequest(request,response){
    var pathname = url.parse(request.url).pathname;
    if(pathname=="/" || pathname=="/list.html"){//访问列表页面
        gotoPage(request,response,"list.html")
    }else if(pathname=="/addpage"){//添加页面功能
        addData(request,response);
    }else if(pathname=='/getlistdata'){//通过myqsl获取数据
        getListData(request,response);
    }else if(pathname=='/updatepage'){//保存修改内容
        updateData(request,response);
    }else if(pathname=='/update'){//修改页面
        updateShow(request,response);
    }else if(pathname=='/deleteonly'){//单个删除
        deleteOnly(request,response);
    }else{
        var requesturl = request.url,  //端口后后面的链接
            suffix = requesturl.substr(requesturl.lastIndexOf('.')); //文件名
        if (suffix === '.html'){//html页面进行跳转
            gotoPage(request,response,requesturl.substr(1)); 
        }else if(suffix === '.css' || suffix === '.js'|| suffix === '.json'
            || suffix === '.ico' || suffix === '.jpg'|| suffix === '.jpeg'|| suffix === '.png'|| suffix === '.gif') {
            
            var file = getFileContent(__dirname  + requesturl),
                contentType = '' ;

            //content-type设置
            switch(suffix){
                case '.css' : contentType = 'text/css' ;break;
                case '.js'  : contentType = 'application/x-javascript' ;break;
                case '.jpg' :
                case '.jpeg' : contentType = 'image/jpeg' ;break;
                case '.png' : contentType = 'image/png' ;break;
                case '.gif' : contentType = 'image/gif' ;break;
                default : contentType = 'text/html' ; break;
            }
            response.writeHead(200, { 'Content-Type': contentType });
            if(file){
                response.end(file);
            }else{
                response.end();
            }
        }else {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end();
        }
    }
}

/******************************************  数据相关方法 ************************************/
/**获取所有数据列表方法**/
function getListData(request,response){
    Client.query(  
        'SELECT * FROM monitor_page_list',  
        function selectCb(err, results, fields) {  
            if (err) {  
                throw err;  
            }  
            //处理空数据
            var dataJson = [];
            if(results){
                
                dataJson = results;
                for (i in results) {
                    dataJson[i].updatetime = results[i].updatetime.Format("yyyy-MM-dd hh:mm:ss");
                }
                dataJson = JSON.stringify(dataJson);
            }else{
                dataJson = false;
            }
            //传送数据，转化为string类型
            response.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});
            response.write(dataJson);
            response.end();
        }  
    ); 
    
}
/**新增方法，保存数据
 * @param {[type]} request  
 * @param {[type]} response 
 */
function addData(request,response){
    var urlstr="";
    request.addListener("data",function(postdata){
        urlstr+=postdata;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
        var jsondata = qs.parse(urlstr);        //转换成json对象
        
        jsondata.updatetime = new Date().Format("yyyy-MM-dd hh:mm:ss");//更新时间

        var sql =  "insert into monitor_page_list SET id='" + new Date().getTime() 
                    + "',name='" + (jsondata.name||'') 
                    + "',url='"+ (jsondata.url||'')
                    + "',businesstype='"+ (jsondata.businesstype ||'')
                    + "',language='"+ (jsondata.language ||'')
                    + "',datatype='"+ (jsondata.datatype ||'')
                    + "',runtype='"+ (jsondata.runtype ||'')
                    + "',reason='"+ (jsondata.reason ||'')
                    + "',dataauthor='"+ (jsondata.dataauthor ||'')
                    + "',opentype='"+ (jsondata.opentype ||'')
                    + "',author='"+ (jsondata.author ||'')
                    + "',record='"+ (jsondata.record ||'')
                    
        if(jsondata.datatime!=''){
            sql += "',datatime='"+ (jsondata.datatime ||'')  ;
        }
        sql += "';" ;

        console.log("sql-----"+sql);
        //数据库更改数据
        Client.query(  
           sql,
           function selectCb(err, results, fields) {  
                if (err) {
                    console.log('数据库更新错误！');  
                    throw err;  
                } 
                console.log('------------数据已保存到数据库中--------------');
            }  
        ); 

    });
    request.addListener("end",function(){
        console.log('添加成功！');
        response.writeHead(301,{ 'Location':'/' }); //重定向
        response.end();
    });
}

/**修改方法，显示数据项。将数据返回到页面。数据返回页面显示不对。
 * @param {[type]} request  
 * @param {[type]} response 
 */
function updateShow(request,response){
    var urlstr = '';
    request.addListener("data",function(postdata){
        urlstr += postdata ;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
        var jsondata = qs.parse(urlstr);        //转换成json对象
        console.log("进入修改页面-------"+jsondata.id);
        //数据库查询数据
        Client.query(  
            'SELECT * FROM monitor_page_list where id =?',
            [jsondata.id] ,
            function selectCb(err, results, fields) {  
                if (err) {
                    console.log('数据库查询错误！');  
                    throw err;  
                }  
                var dataJson = [];
                if(results.length==1){
                    dataJson = results[0];
                    // dataJson.datatime = results[0].datatime.Format("yyyy-MM-dd hh:mm:ss");
                    dataJson.updatetime = results[0].updatetime.Format("yyyy-MM-dd hh:mm:ss");
                }else{
                    dataJson = '数据不存在！';
                }
                urlstr  =  JSON.stringify(dataJson);
                response.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});
                response.write(urlstr);
                console.log('跳转到修改页面，数据传送成功！');
                response.end();
                
            }  
        ); 
    });
}

/**修改方法，保存数据
 * @param {[type]} request  
 * @param {[type]} response 
 */
function updateData(request,response){
    console.log('---------------进入修改保存功能---------------');
    var urlstr = '';
    request.addListener("data",function(postdata){
        urlstr += postdata;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
        var jsondata = qs.parse(urlstr);        //转换成json对象
        console.log("修改的数据-------"+jsondata.businesstype);
        if(jsondata.id==''){
            console.log('改数据不存在！');
            return false;
        }
        var sql =  "UPDATE monitor_page_list SET name='" + (jsondata.name||'') 
                    + "',url='"+ (jsondata.url||'')
                    + "',businesstype='"+ (jsondata.businesstype ||'')
                    + "',language='"+ (jsondata.language ||'')
                    + "',datatype='"+ (jsondata.datatype ||'')
                    + "',runtype='"+ (jsondata.runtype ||'')
                    + "',reason='"+ (jsondata.reason ||'')
                    + "',dataauthor='"+ (jsondata.dataauthor ||'')
                    + "',opentype='"+ (jsondata.opentype ||'')
                    + "',author='"+ (jsondata.author ||'')
                    + "',record='"+ (jsondata.record ||'')
                    + "',datatime='"+ (jsondata.datatime ||'')
                    + "' where id='"+jsondata.id+"'"  ;
        console.log("sql-----"+sql);
        //数据库更改数据
        Client.query(  
           sql,
           function selectCb(err, results, fields) {  
                if (err) {
                    console.log('数据库更新错误！');  
                    throw err;  
                } 
                console.log('------------数据已保存到数据库中--------------');
            }  
        ); 

    });
    request.addListener("end",function(){
        response.writeHead(301,{ 'Location':'/' }); //重定向
        response.end();
    });
}

/**单个数据删除方法，保存数据
 * @param {[type]} request  
 * @param {[type]} response 
 */
function deleteOnly(request,response){
    var urlstr = '';
    request.addListener("data",function(postdata){
        urlstr+=postdata;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
        var jsondata = qs.parse(urlstr);        //转换成json对象
        var id = jsondata.id;

        Client.query(  
           'DELETE FROM monitor_page_list WHERE id =?; ',
           [jsondata.id],
           function selectCb(err, results, fields) {  
                if (err) {
                    console.log('数据库删除错误！');  
                    throw err;  
                } 
                console.log('------------数据已从数据库中删除！--------------');
            }  
        ); 

    });
    request.addListener("end",function(){
        response.writeHead(301,{ 'Location':'/' }); //重定向
        response.end();
    });
}

/****************************************** 赋值   ******************************/
function setDataJson(jsondata){
    var id = jsondata.id,
        dataArr = fs.readFileSync(FileJson,'utf-8') , //去读文件
        fileDate=[];
        size = 0;
    if(dataArr !=''){ //判断非空
        fileDate = eval("("+dataArr+")");  //string 类型转为 object类型
        size = fileDate.length ;
    }
    
    //遍历已有数据，取出需要修改的数据，进行替换
    for (var i = 0; i < size; i++) {
        //console.log(i+'-------'+fileDate[i].id);
        if(fileDate[i].id==id){
            //console.log(typeof(fileDate[i])+'----'+typeof(jsondata));
            fileDate[i].name =  jsondata.name;
            fileDate[i].url = jsondata.url;
            fileDate[i].businesstype = jsondata.businesstype;
            fileDate[i].language = jsondata.language;
            fileDate[i].datatype = jsondata.datatype;
            fileDate[i].runtype = jsondata.runtype;
            fileDate[i].reason = jsondata.reason;
            fileDate[i].dataauthor = jsondata.dataauthor;
            fileDate[i].opentype = jsondata.opentype;
            fileDate[i].author = jsondata.author;
            fileDate[i].record = jsondata.record;
            fileDate[i].datatime = jsondata.datatime;
            fileDate[i].updatetime = new Date().Format("yyyy-MM-dd hh:mm:ss");//更新时间
            break;
        }
    }

    return JSON.stringify(fileDate);//返回string数据类型
}
/****************************************** 页面跳转相关方法 ****************************************/
/**页面跳转方法
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @param  {String} filename 文件名称
 */
function gotoPage(request,response,filename){
    response.writeHead(200,{"Content-Type":"text/html"});
    fs.readFile(filename,"utf-8",function(e,data){
        response.write(data);
        response.end();
    });
}

//获取链接地址
function getFileContent(filepath){
    try{
        return fs.readFileSync(filepath);
    }catch(e){
        console.log('文件不存在：'+filepath);
        return false ;
    }
}

//日期格式化
Date.prototype.Format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}



