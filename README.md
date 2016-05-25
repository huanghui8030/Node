#NPM使用介绍

NPM是随同NodeJS一起安装的包管理工具，能解决NodeJS代码部署上的很多问题，常见的使用场景有以下几种：

>*允许用户从NPM服务器下载别人编写的第三方包到本地使用。
>*允许用户从NPM服务器下载并安装别人编写的命令行程序到本地使用。
>*允许用户将自己编写的包或命令行程序上传到NPM服务器供别人使用。

由于新版的nodejs已经集成了npm，所以之前npm也一并安装好了。同样可以通过输入 "npm -v" 来测试是否成功安装。命令如下，出现版本提示表示安装成功:
$ npm -v
2.3.0
如果你安装的是旧版本的 npm，可以很容易得通过 npm 命令来升级，命令如下：
$ sudo npm install npm -g
/usr/local/bin/npm -> /usr/local/lib/node_modules/npm/bin/npm-cli.js
npm@2.14.2 /usr/local/lib/node_modules/npm
如果是 Window 系统使用以下命令即可：
npm install npm -g


###NPM 常用命令
除了本章介绍的部分外，NPM还提供了很多功能，package.json里也有很多其它有用的字段。
除了可以在npmjs.org/doc/查看官方文档外，这里再介绍一些NPM常用命令。
>* NPM提供了很多命令，例如install和publish，使用npm help可查看所有命令。
>* NPM提供了很多命令，例如install和publish，使用npm help可查看所有命令。
使用npm help <command>可查看某条命令的详细帮助，例如npm help install。
>* 在package.json所在目录下使用npm install . -g可先在本地安装当前命令行程序，可用于发布前的本地测试。
 >*使用npm update <package>可以把当前目录下node_modules子目录里边的对应模块更新至最新版本。
>* 使用npm update <package> -g可以把全局安装的对应命令行程序更新至最新版。
>* 使用npm cache clear可以清空NPM本地缓存，用于对付使用相同版本号发布新版本代码的人。
>* 使用npm unpublish <package>@<version>可以撤销发布自己发布过的某个版本代码。


