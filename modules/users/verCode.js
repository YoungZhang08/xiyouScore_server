//获取验证码，返回session
var request = require('request');
var fs = require('fs');

var getVercode = function (callback) {
    var options = {
        url : 'http://222.24.62.120/CheckCode.aspx',
        method : 'GET',
        encoding : null,
        Accept : 'image/webp,image/*,*/*;q=0.8',
        headers : {
            Referer : 'http://222.24.62.120/'
        }
    };

    request(options,function(err,res,body){
        if(err){
            callback(true,'Server Error');
            return;
        }
        var session = res.headers['set-cookie'][0];
        session = session.substr(0,session.indexOf(';'));
        if(!session){
            callback('Server Error');
            return;
        }

        var imgBuf = body.toString('base64');
        imgBuf = 'data:image/Gif;base64,' + imgBuf;
        callback(false,{
            session : session,
            verCode : imgBuf
        });
    });
};

module.exports = getVercode;