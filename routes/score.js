var express = require('express');
var router = express.Router();

//引进模块
var semester = require('../modules/score/semester');
var json = require('../modules/users/json');

//获取成绩
router.use('/semester',function (req,res) {
    var options = {
        username : req.query.username,
        session : req.query.session,
        name : req.query.name,
        year : req.query.year,
        semester : req.query.semester
    };

    console.log(options.username);
    console.log(options.session);
    console.log(options.name);
    console.log(options.year);
    console.log(options.semester);
    semester(options,function (err,result) {
        // console.log(result);
        json(res,err,result);
    });
});

module.exports = router;