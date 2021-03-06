/**
 * Created by YoungZhang on 2017/7/20.
 */
var express = require('express');
var router = express.Router();

//引进模块
var makeUp = require("../modules/makeUp/makeUp");
var json = require("../modules/users/json");

//补考查询
router.use('/makeUp', function(req, res) {
    var options = {
        username: req.query.username,
        session: req.query.session,
        name: req.query.name
    };
    makeUp(options, function(err, result) {
        json(res, err, result);
    });
});

module.exports = router;