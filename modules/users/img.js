
var request = require('request');

var getImg = function (data,res) {

    var options = {
        url : 'http://222.24.62.120/readimagexs.aspx?xh=' + data.username,
        method: "GET",
        Accept : "image/webp,image/*,*/*;q=0.8",
        'Accept-Encoding' : 'gzip',
        headers: {
            Referer: "http://222.24.62.120/xsgrxx.aspx?gnmkdm=N121501&" +
            "xh=" + data.username + "&xm=" + encodeURI(data.name),
            Cookie: data.session
        }
    };
    request(options).pipe(res);

};

module.exports = getImg;