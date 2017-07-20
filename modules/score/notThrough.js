/**
 * Created by YoungZhang on 2017/7/20.
 */
var request = require("request");
var iconv = require('iconv-lite');
var cheerio = require("cheerio");

var notThrough = function (data,callback) {
    var options = {
        url : "http://222.24.62.120/xscjcx.aspx?gnmkdm=N121605&"+
        "xh=" + data.username + "&xm=" + encodeURI(data.name),
        method: "GET",
        encoding: null,
        headers: {
            Referer: "http://222.24.62.120/xs_main.aspx?xh=" + data.username,
            Cookie: data.session
        }
    };

    request(options,function(err, res, body) {
        if (err) {
            callback("Server Error", err);
            return;
        }
        body = iconv.decode(body, "GB2312").toString();
        var $ = cheerio.load(body);
        var tr = $("#Datagrid3").find('tr');
        var result = [];

        for (var i = 0; i < tr.length - 1; i++) {
            var td = tr.eq(i + 1).find("td");
            var res = {
                'className': td.eq(1).text(),
                'nature': td.eq(2).text(),
                'credit': td.eq(3).text(),
                'highest': td.eq(4).text()
            };

            result.push(res);
        }
        callback(false, result);
    });
}

module.exports = notThrough;