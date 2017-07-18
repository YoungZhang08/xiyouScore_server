
var request = require('request');
var fs = require('request');

var getImg = function (data,res,callback) {
    var options = {
        url : 'http://222.24.62.120/readimages.aspx?xh=' + data.username,
        method : 'GET',
        Accept : 'image/webp,image/*,*/*;q=0.8',
        headers : {
            Referer : 'http://222.24.62.120/xsgrxx.aspx?gnmkdm=N121501&' + 'xh=' + data.username + '&xm=' + encodeURI(data.name),
            Cookie : data.session
        }
    };

    request(options,function (err,res) {
        if(err){
            callback(true,"Server Error");
            return;
        }
        if(Math.floor(res.statusCode / 100) === 3){
            callback(true,"Session Out");
            return;
        }
    }).pipe(res);
};

module.exports = getImg;