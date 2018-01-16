var svnInfo = require('svn-info');


var svnUrl = 'https://svn.chsi.com.cn/svn/repos/mis/trunk/webapp/src/main/webapp/monitor/manage/list.html';
/*//异步获取svn信息的方法
svnInfo(svnUrl, 'HEAD', function(err, info) {
    if(err) {
    throw err;
    }
    console.log(info.lastChangedAuthor);
    console.log(info.lastChangedDate)
    console.log(info);
});

//同步获取svn信息的方法
var  info  = svnInfo.sync(svnUrl, 'HEAD') ;  
console.log(info);
*/
var child_process = require('child_process');
var svnUrl = 'svn info ' + svnUrl;
child_process.exec(svnUrl,function(error,stdout,stderr){
    if (error) {
        console.error("exec error:"+error);
        return;
    }
    console.log(stdout);
    var author = stdout.substring(stdout.indexOf('Last Changed Author:')+21,stdout.indexOf('Last Changed Rev:'));
    console.log(author+author.length);
    var date = stdout.substr(stdout.indexOf('Last Changed Date:')+19,10);
    console.log(date+date.length);

});