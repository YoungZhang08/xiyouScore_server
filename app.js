//这些依赖库原来都是封装在connect里面，但是现在需要单独加载
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//加载路由控制
var users = require('./routes/users');
var score = require('./routes/score');
var makeUp = require('./routes/makeUp');

//创建项目实例
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('youngzhang'));
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: 'youngzhang' // 与cookieParse中的一致
}));

app.use('/users', users);   //访问路径/users
app.use('/score',score);    //访问路径/score
app.use('/makeUp',makeUp);  //访问根路径/makeUp

//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(8000,function () {
    console.log('Server running: http://localhost:8000');
});

module.exports = app;
