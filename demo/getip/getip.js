//获取本机ip地址
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

var ip = getIPAdress();
console.log("\n--------IP地址：" + ip+ "------\n");

//客服端ip地址
function getClientIp(req) {  
    var ipAddress;  
    var forwardedIpsStr = req.header('x-forwarded-for');   
    if (forwardedIpsStr) {  
        var forwardedIps = forwardedIpsStr.split(',');  
        ipAddress = forwardedIps[0];  
    }  
    if (!ipAddress) {  
        ipAddress = req.connection.remoteAddress;  
    }  
    return ipAddress;  
} 
