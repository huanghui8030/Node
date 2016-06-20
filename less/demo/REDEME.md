###  Less 学习
- `[less中文网](http://lesscss.cn)`

### 注意事项
- 引用lessjs时，less文件要在前面引用，js在后面，引入方法，如下
> <link rel="stylesheet/less" type="text/css" href="style.less" />
> <script src="less.js" type="text/javascript"></script>
- 可以通过其他工具先将less文件转为css在引入到项目中
> `[SimpLESS](http://wearekiss.com/simpless)`
- 通过npm方法引入
> 导入全局变量的less ：$ sudo npm install -g less
> 直接编译 `less文件`：$ lessc styles.less
> 将 `less文件` 转化为 `css文件` ： $ lessc styles.less styles.css
> 将 `less文件` 转化为 `css压缩文件` : $ lessc --clean-css styles.less styles.min.css
> 将 `css文件` 转化为 `css压缩文件` : $ lessc --clean-css styles.css styles.min.css


