//ode.js DNS 模块用于解析域名。引入 DNS 模块语法格式如下：
var dns = require('dns');

dns.lookup('www.github.com', function onLookup(err, address, family) {
   console.log('ip 地址:', address);
   dns.reverse(address, function (err, hostnames) {
   if (err) {
      console.log(err.stack);
   }

   console.log('反向解析 ' + address + ': ' + JSON.stringify(hostnames));
});  
});
//ip 地址: 192.30.252.128
//反向解析 192.30.252.128: ["github.com"]

/*
rrtypes
以下列出了 dns.resolve() 方法中有效的 rrtypes值:
'A' IPV4 地址, 默认
'AAAA' IPV6 地址
'MX' 邮件交换记录
'TXT' text 记录
'SRV' SRV 记录
'PTR' 用来反向 IP 查找
'NS' 域名服务器记录
'CNAME' 别名记录
'SOA' 授权记录的初始值
**/
/**
每次 DNS 查询都可能返回以下错误码：
dns.NODATA: 无数据响应。
dns.FORMERR: 查询格式错误。
dns.SERVFAIL: 常规失败。
dns.NOTFOUND: 没有找到域名。
dns.NOTIMP: 未实现请求的操作。
dns.REFUSED: 拒绝查询。
dns.BADQUERY: 查询格式错误。
dns.BADNAME: 域名格式错误。
dns.BADFAMILY: 地址协议不支持。
dns.BADRESP: 回复格式错误。
dns.CONNREFUSED: 无法连接到 DNS 服务器。
dns.TIMEOUT: 连接 DNS 服务器超时。
dns.EOF: 文件末端。
dns.FILE: 读文件错误。
dns.NOMEM: 内存溢出。
dns.DESTRUCTION: 通道被摧毁。
dns.BADSTR: 字符串格式错误。
dns.BADFLAGS: 非法标识符。
dns.NONAME: 所给主机不是数字。
dns.BADHINTS: 非法HINTS标识符。
dns.NOTINITIALIZED: c c-ares 库尚未初始化。
dns.LOADIPHLPAPI: 加载 iphlpapi.dll 出错。
dns.ADDRGETNETWORKPARAMS: 无法找到 GetNetworkParams 函数。
dns.CANCELLED: 取消 DNS 查询。

**/