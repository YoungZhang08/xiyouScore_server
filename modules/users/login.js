//登录 获取session

var request = require("request");
var cheerio = require("cheerio");
var iconv = require("iconv-lite");

var login = function (data,callback) {
    if(data.username == '' || data.password == ''){
        callback("Account Error");
        return;
    }

    var formData = {
        '__VIEWSTATE' : 'dDwtNTE2MjI4MTQ7Oz5O9kSeYykjfN0r53Yqhqckbvd83A==',
        'txtUserName' : data.username,
        'TextBox2' : data.password,
        'txtSecretCode' : data.verCode,
        'RadioButtonList1' : '%D1%A7%C9%FA',
        'Button1': '',
        'lbLanguage' : '',
        'hidPdrs' : '',
        'hidsc' : ''
    };

    var options = {
        url : 'http://222.24.62.120/default2.aspx',
        method : 'POST',
        form : formData,
        headers : {
            Referer : 'http://222.24.62.120/',
            Cookie : data.session
        }
    };

    request(options,function (err,res,body) {
        if(err){
            callback("Server Error",err);
            return;
        }

        var body = iconv.decode(body, "GB2312").toString();
        var ifSuccess = body.indexOf('Object moved');
        if (ifSuccess == -1) {
            callback(true,'Please check your password or vercode');
            return;
        }else{
            getName(data,callback);
        }
    });
};

var getName = function (data,callback) {
    var options = {
        url : 'http://222.24.62.120/xs_main.aspx?xh=' + data.username,
        method : 'GET',
        encoding : null,
        headers : {
            Referer : "http://222.24.62.120/",
            Cookie : data.session
        }
    };

    request(options,function (err,res,body) {
        if(err){
            callback(true,err);
            return;
        }
        var body = iconv.decode(body, "GB2312").toString();
        var $ = cheerio.load(body);
        var name = $("#xhxm").text().replace("同学","");

        callback(false,name);

    });
}

module.exports = login;