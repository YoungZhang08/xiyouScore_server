//登录获取个人信息
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var getInfo = function (data,callback) {
    var options = {
        url : 'http://222.24.62.120/xsgrxx.aspx?gnmkdm=N121501&xh=' + data.username + '&xm=' + encodeURI(data.name),
        method : 'GET',
        encoding : null,
        headers : {
            Referer : 'http://222.24.62.120/xs_main.aspx?xh=' + data.username,
            Cookie : data.session
        }
    };

    request(options,function (err,res,body) {
        if(err){
            callback(true,"Server Error");
            return;
        }
        if(Math.floor(res.statusCode / 100) === 3)
        {
            callback(true,"Session Out");
            return;
        }

        var body = iconv.decode(body,"GB2312").toString();
        var $ = cheerio.load(body);
        var data = {};
        data.username = $('#xh').text();        //学号
        data.name = $('#xm').text();            //姓名
        data.sex = $('#lbl_xb').text();         //性别
        data.birthday = $('#lbl_csrq').text();  //出生日期
        data.academy = $('#lbl_xy').text();     //学院
        data.class = $('#lbl_xzb').text();      //行政班
        data.level = $('#lbl_dqszj').text();    //当前所在级
        data.candidate = $('#lbl_ksh').text();  //考生号

        // console.log(data);
        callback(false,data);
    });
};

module.exports = getInfo;


