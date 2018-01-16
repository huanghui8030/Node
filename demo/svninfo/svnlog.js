var child_process = require('child_process') ;

var  svnLog = ' svn log https://svn.chsi.com.cn/svn/repos/mis/trunk/webapp/src/main/webapp/monitor/dwfw/dwfw001.html  -l 1';

//异步方法
child_process.exec(svnLog,function(error,stdout,stderr){
    if (error) {
        console.error("exec error:"+error);
        return;
    }
    console.log(stdout);
    var dataArr = stdout.split('\n')
    var content = dataArr[3];
    console.log(content);
    var otherInfo =  dataArr[1].split('| ');

    var author = otherInfo[1].substr(0,otherInfo[1].length-1);
    console.log(author);
    var date = otherInfo[2].substr(0,10);
    console.log(date);
});

//同步方法
/*var data = child_process.execSync(svnLog).toString();
console.log(data);
var dataArr = data.split('\n')
var content = dataArr[3];
console.log(content+content.length);
var otherInfo =  dataArr[1].split('| ');

var author = otherInfo[1].substr(0,otherInfo[1].length-1);
console.log(author+author.length);
var date = otherInfo[2].substr(0,10);
console.log(date+date.length);*/


