var express = require('express');
var router = express.Router();

//引进模块
var verCode = require("../modules/users/verCode");
var login = require("../modules/users/login");
var info = require("../modules/users/info");
var getImg = require("../modules/users/img");
var json = require("../modules/users/json");

//验证码
router.use('/verCode',function(req,res) {
    verCode(function(err,result) {
        json(res,err,result);
    });
});

//登录
router.use('/login',function (req,res) {
    // console.log(res);
    var options = {
        username : req.query.username,
        password : req.query.password,
        verCode : req.query.verCode,
        session : req.query.session
    }
    console.log(options);
    login(options,function (err,result) {
        console.log(result);
        json(res,err,result);
    });
});

//用户信息
router.use('/info', function(req, res) {
    var data = {
        name: req.query.name,
        username: req.query.username,
        session: req.query.session
    };

    info(data, function(err, result) {
        json(res, err, result);
    });
});

//用户照片
router.use('/img',function (req,res) {
    var data = {
        username : req.query.username,
        session : req.query.session,
        name : req.query.name
    };

    getImg(data,res);
});

module.exports = router;
