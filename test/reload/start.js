test();
function test() {
    console.log("服务进行中。。。");
 
    setTimeout(function () {
        console.log('模拟各种异步业务逻辑。。。');
        //业务正常执行完成，系统退出。
        process.exit(0);
    },1000);
}
