/**
 * nodejs+mysql 实现数据的增删查改
 * 登录拦截器 session
 * huangh  20171026
 */
var httpserver = require("http") ,
    qs = require("querystring") ,
    url = require("url") ,
    fs = require("fs"),
    mysql = require("mysql"),
    child_process = require('child_process'),
    iconv = require('iconv-lite') ;  //解决编码问题 
    

//创建连接  
var Client = mysql.createConnection({  
    host: '172.16.1.34',
    user: 'mysql',
    password: 'chsiCHSI123',
    database:'mysql',
    port: 3306 
}); 


Client.connect();

httpserver.createServer(onRequest).listen(3000);


var serverIp = getIPAdress();
console.log('-----服务器已启动，请在浏览器中输入：http://'+serverIp+':3000/');



function onRequest(request,response){
    var pathname = url.parse(request.url).pathname;

    var cookie = request.headers.cookie.split(';');
    ///console.log(cookie);
    var username = cookie[0].split('=')[1];
    var password = cookie[1].split('=')[1];
    
    if(!(username=='huangh' && password=='123456')){//登录
        //pathname = '/login.html';
    }

    console.log(pathname);
    switch(pathname){
        case "/" : 
            var html = "login.html";
            /*if(username=='huangh' && password=='123456'){//登录
                html = "list.html";
            }*/
            gotoPage(request,response,html);//访问登录页面 
            break;
        case "/loginsubmit" : 
            loginSubmit(request,response); //登录提交
            break;
        case "/list.html" : 
            gotoPage(request,response,"list.html");//访问列表页面
            break;
        case "/addpage" : 
            addData(request,response);//添加页面功能
            break;
        case "/getlistdata" : 
            getListData(request,response); //通过mysql获取数据
            break;
        case "/updatepage" : 
            updateData(request,response); //保存修改内容
            break;
        case "/update" : 
            updateShow(request,response); //修改页面
            break;
        case "/deleteonly" : 
            deleteOnly(request,response); //单个删除
            break;
        default : 
            defaluGoto(request,response); //默认跳转
            break;
        
    }
}

//默认跳转
function defaluGoto(request,response){
    var requesturl = request.url,  //端口后后面的链接
        suffix = requesturl.substr(requesturl.lastIndexOf('.')); //文件名
    //console.log(requesturl);
    if (suffix === '.html'){//html页面进行跳转
        gotoPage(request,response,requesturl.substr(1)); 
        console.log(getClientIp(request)+'进入'+requesturl+'页面');
    }else if(suffix === '.css' || suffix === '.js'|| suffix === '.json'
        || suffix === '.jpg'|| suffix === '.jpeg'|| suffix === '.png'|| suffix === '.gif') {
        
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

/****************************************** 登录相关方法 *************************************/
function loginSubmit(request,response){
    //console.log('用户进入登录页面');
    var urlstr = "";

    request.addListener("data",function(postdata){
        urlstr += postdata;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
        var jsondata = qs.parse(urlstr);        //转换成json对象
        urlstr = jsondata;
    });
    request.addListener("end",function(){
        if(urlstr.username=='huangh' && urlstr.password=='123456'){
            console.log('用户登录成功！');  
            var Cookies = {};
            request.headers.cookie && request.headers.cookie.split(';').forEach(function( Cookie ) {
            var parts = Cookie.split('=');
                Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
            });

            //console.log(Cookies);
            //获取当前时间
            var date = new Date();
            //将date设置为1分钟后失效
            date.setTime(date.getTime()+ 30*1000);
            // 向客户端设置一个Cookie
            response.writeHead(301, {
                'Set-Cookie': 'username=huangh;password=123456;expire='+date.toGMTString()+';HttpOnly;',
                'Content-Type': 'text/plain',
                'Location':'/list.html'
            });
            console.log(Cookies);

           // response.writeHead(301,{ 'Location':'/list.html' }); //重定向
            response.end();
        }else{
            fs.readFile('login.html',function(err,data){
                if(err){
                    throw err;
                }else{
                    //console.log(data.toString());
                    data += "<span class='color-red'>用户名或密码错误！</span>";
                    response.end(data);
                }
            });
            
            response.setHeader('Content-Type','text/html; charset=utf-8');
        }
    });
}

/******************************************  数据相关方法 ************************************/

/**获取所有数据列表方法**/
function getListData(request,response){
    console.log(getClientIp(request)+'进入查询页面');
    var urlstr = "";
    request.addListener("data",function(postdata){
        urlstr+=postdata;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
        var jsondata = qs.parse(urlstr);        //转换成json对象
        var sql =  "SELECT * FROM monitor_page_list WHERE name LIKE '%" + (jsondata.name||'')  + "%' ";
        if(jsondata.businesstype!=''){
            sql += "AND businesstype LIKE '%"+jsondata.businesstype+"%' ";
        }
        if(jsondata.language!=''){
            sql += "AND language='"+jsondata.language+"' ";
        }
        if(jsondata.datatype!=''){
            sql += "AND datatype = '"+jsondata.datatype+"' ";
        }
        if(jsondata.runtype!=''){
            sql += "AND runtype='"+jsondata.runtype+"' ";
        }
        if(jsondata.opentype!=''){
            sql += "AND opentype='"+jsondata.opentype+"' ";
        }
        sql += "AND deleteflag='false';" ;        
        console.log("sql条件查询语句："+sql);

         //处理空数据
        var dataJson = {
            results:[],
            flag : true,
            search:{
                name : jsondata.name,
                businesstype : jsondata.businesstype,
                language: jsondata.language,
                datatype: jsondata.datatype,
                runtype: jsondata.runtype,
                opentype: jsondata.opentype
            }
        };
        Client.query(  
            sql,  
            function selectCb(err, results, fields) {  
                if (err) {  
                    throw err;  
                }
                if(results!=''){
                    dataJson.results = results;
                }else{
                    dataJson.flag = false;
                }
                //传送数据，转化为string类型
                response.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});
                response.write(JSON.stringify(dataJson));
                response.end();
            }  
        ); 
    });
}
/**新增方法，保存数据
 * @param {[type]} request  
 * @param {[type]} response 
 */
function addData(request,response){
    console.log(getClientIp(request)+"新增了一条数据");
    var urlstr="";
    request.addListener("data",function(postdata){
        urlstr+=postdata;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
        var jsondata = qs.parse(urlstr);        //转换成json对象
        //必填项7个
        if(jsondata.name == '' ||  jsondata.url== '' ||  jsondata.businesstype == '' ||  jsondata.language =='' 
            || jsondata.datatype =='' || jsondata.runtype =='' || jsondata.opentype ==''){
            console.log('--------------必填项未填写，无法成功提交数据！--------------');
            return false;
        }

        var sql =  "insert into monitor_page_list SET id='" + new Date().getTime() 
                    + "',name='" + (jsondata.name||'') 
                    + "',url='"+ (jsondata.url||'')
                    + "',businesstype='"+ (jsondata.businesstype ||'')
                    + "',language='"+ (jsondata.language ||'')
                    + "',datatype='"+ (jsondata.datatype ||'')
                    + "',runtype='"+ (jsondata.runtype ||'')
                    + "',reason='"+ (jsondata.reason ||'')
                    + "',opentype='"+ (jsondata.opentype ||'') 
                    + "',dataauthor='"+ (jsondata.dataauthor ||'')
                    + "',datatime='"+ (jsondata.datatime ||'') 
                    + "',deleteflag='false';";

        console.log("sql插入数据："+sql);
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
        //console.log('添加成功！');
        response.writeHead(301,{ 'Location':'/list.html' }); //重定向
        response.end();
    });
}

/**修改方法，显示数据项。将数据返回到页面。数据返回页面显示不对。
 * @param {[type]} request  
 * @param {[type]} response 
 */
function updateShow(request,response){

    console.log( getClientIp(request) +"进入了修改页面");

    var urlstr = '';
    request.addListener("data",function(postdata){
        urlstr += postdata ;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
        var jsondata = qs.parse(urlstr);        //转换成json对象
        var sql = "SELECT * FROM monitor_page_list WHERE id ='"+jsondata.id+"' AND deleteflag='false';";
        console.log("sql单条查询语句："+sql);
        //数据库查询数据
        Client.query(  
            sql,
            function selectCb(err, results, fields) {  
                if (err) {
                    console.log('数据库查询错误！');  
                    throw err;  
                }  
                var dataJson = {
                    results  : [],
                    flag : true,
                    msg :'' 
                };
                if(results.length==1){
                    dataJson.results = results[0];

                    var svnUrl = "https://svn.chsi.com.cn/svn/repos/mis/trunk/webapp/src/main/webapp/monitor/" + dataJson.results.url;
                     //获取svn 信息
                    var svnLog = 'svn log '+svnUrl+'  -l 1';
                    
                    //console.log(svnLog);

                    try{
                        var encoding = 'UTF-8';
                        if(serverIp=='172.16.1.34'){//如果为测试服务器，则用gbk编码；本机上用utf-8
                            encoding = 'GBK';
                        }
                        var logStr = child_process.execSync(svnLog,encoding);
                        var data = iconv.decode(new Buffer(logStr), encoding);//解决字符编码问题
                        
                        var dataArr = data.split('\n');
                        var otherInfo =  dataArr[1].split('| ');
                        //获取svn记录信息
                        dataJson.results.author = otherInfo[1].substr(0,otherInfo[1].length-1) ;
                        dataJson.results.updatetime = otherInfo[2].substr(0,19);
                        dataJson.results.record = dataArr[3];

                        console.log("svn记录："+dataJson.results.author+","+dataJson.results.updatetime+","+dataJson.results.record);
                    }catch(e){

                        console.log('页面链接不对：'+svnUrl);
                        dataJson.results.author = '';
                        dataJson.msg = '页面链接不对，无法获取到svn信息!';
                    }
                    

                }else{
                    dataJson.flag = false;
                    dataJson.msg = '数据库中不存在该数据！';
                }

                urlstr  =  JSON.stringify(dataJson);
                response.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});
                response.write(urlstr);
                //console.log('跳转到修改页面，数据传送成功！');
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
    console.log(getClientIp(request)+"修改了一条数据");
    var urlstr = '';
    request.addListener("data",function(postdata){
        urlstr += postdata;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
        var jsondata = qs.parse(urlstr);        //转换成json对象
        //console.log("修改的数据："+jsondata.businesstype);
        if(jsondata.id==''){
            console.log('改数据不存在！');
            return false;
        }
        var sql =  "UPDATE monitor_page_list SET name='" + (jsondata.name||'') 
                    + "',url='" + (jsondata.url||'')
                    + "',businesstype='" + (jsondata.businesstype ||'')
                    + "',language='" + (jsondata.language ||'')
                    + "',datatype='" + (jsondata.datatype ||'')
                    + "',runtype='" + (jsondata.runtype ||'')
                    + "',reason='" + (jsondata.reason ||'')
                    + "',dataauthor='" + (jsondata.dataauthor ||'')
                    + "',opentype='" + (jsondata.opentype ||'')
                    + "' where id='" + jsondata.id 
                    + "' AND deleteflag='false';"  ;
        console.log("sql更新语句："+sql);
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
        response.writeHead(301,{ 'Location':'/list.html' }); //重定向
        response.end();
    });
}

/**单个数据删除方法，保存数据
 * @param {[type]} request  
 * @param {[type]} response 
 */
function deleteOnly(request,response){
    console.log(getClientIp(request)+"删除了一条数据");
    var urlstr = '';
    request.addListener("data",function(postdata){
        urlstr+=postdata;    //接收到的表单数据字符串，这里可以用两种方法将UTF-8编码转换为中文
        var jsondata = qs.parse(urlstr);        //转换成json对象
        var id = jsondata.id;
        //var sql = "DELETE FROM monitor_page_list WHERE id ='"+jsondata.id+"';" ;
        var sql = "UPDATE monitor_page_list  SET deleteflag='true' WHERE id='"+jsondata.id+"';";
        console.log("sql删除语句："+sql);
        Client.query(  
           sql,
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
        response.writeHead(301,{ 'Location':'/list.html' }); //重定向
        response.end();
    });
}


/****************************************** 页面跳转相关方法 ****************************************/
/**页面跳转方法
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @param  {String} filename 文件名称
 */
function gotoPage(request,response,filename){
    response.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});
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

//获取本机服务器ip地址
function getIPAdress() {
    var interfaces = require('os').networkInterfaces();　　
    for (var devName in interfaces) {　　　　
        var iface = interfaces[devName];　　　　　　
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }　　
    }
}

//获取客户端ip地址
function getClientIp(req) {
    var ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if(ip.split(',').length>0){
        ip = ip.split(',')[0]
    }
    ip = ip.substr(ip.lastIndexOf(':')+1,ip.length);
    //console.log("ip:"+ip);
    return "\n-------"+ip+"，"+new Date().Format("yyyy-MM-dd hh:mm:ss")+"-----";  
};

