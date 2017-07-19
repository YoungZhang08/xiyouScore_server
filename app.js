//这些依赖库原来都是封装在connect里面，但是现在需要单独加载
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//加载路由控制
var users = require('./routes/users');
var score = require('./routes/score');

//创建项目实例
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', users);   //访问路径/users
app.use('/score',score);   //访问路径/score

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
