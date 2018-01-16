var express = require('express');
var router = express.Router();

var User = {
    username : 'huangh',
    pwd:'123456'
}
console.log(User.username+'---'+User.pwd);
/* GET index page. */
router.get('/', function(req, res,next) {

    if(!req.session.user){                  //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录"
        //res.redirect("/login");             //未登录则重定向到 /login 路径
        res.render("login",{title:'User Login'});
    }else{
        res.render("home",{username:req.session.user.username});  
    }
    
 
});

/* GET login page. */
router.route("/login").post(function(req,res){                     // 从此路径检测到post方式则进行post数据的处理操作
    var uname = req.body.uname;             //获取post上来的 data数据中 uname的值
    var pwd = req.body.upwd;
    console.log("后台输入的名字："+uname+'---'+pwd);
    if(uname!=User.username){
        req.session.error = '用户名不存在';
        res.send(404); 
    }else{
        if(pwd!=User.pwd){
            req.session.error = "密码错误";
            res.send(404);
        }else{
            req.session.user = User;
            res.send(200);
        }
    } 
});


/* GET home page. 
router.get("/home",function(req,res){ 
    //console.log(req.session.user);
    if(!req.session.user){                  //到达/home路径首先判断是否已经登录
        req.session.error = "请先登录"
        res.redirect("/login");             //未登录则重定向到 /login 路径
    }
    res.render("home",{username:req.session.user.username});         //已登录则渲染home页面
});*/

/* GET logout page. */
router.get("/logout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
    req.session.user = null;
    req.session.error = null;
    res.redirect("/");
});

module.exports = router;