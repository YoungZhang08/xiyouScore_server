var express = require('express');
var router = express.Router();

//引进模块
var semester = require('../modules/score/semester');
var all = require('../modules/score/allYear');
var notThrough = require('../modules/score/notThrough');
var json = require('../modules/users/json');

//获取学年成绩
router.use('/all', function(req, res) {
    var options = {
        username: req.query.username,
        session: req.query.session,
        name: req.query.name
    };

    all(options, function(err, result) {
        json(res, err, result);
    })
})

//获取未通过的成绩
router.use('/notThrough', function(req, res) {
    var options = {
        username: req.query.username,
        session: req.query.session,
        name: req.query.name
    };
    notThrough(options, function(err, result) {
        json(res, err, result);
    });
});

//获取学期成绩
router.use('/semester', function(req, res) {
    var options = {
        username: req.query.username,
        session: req.query.session,
        name: req.query.name,
        year: req.query.year,
        semester: req.query.semester
    };

    semester(options, function(err, result) {
        // console.log(result);
        json(res, err, result);
    });
});

module.exports = router;