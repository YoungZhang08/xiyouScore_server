/**
 * Created by YoungZhang on 2017/7/20.
 */
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var makeUp = function(data, callback) {
    var options = {
        url: 'http://222.24.62.120/xsbkkscx.aspx?gnmkdm=N121618&xh=' + data.username + '&xm=' + encodeURI(data.name),
        method: 'GET',
        encoding: null,
        headers: {
            Referer: 'http://222.24.62.120/xs_main.aspx?xh=' + data.username,
            Cookie: data.session
        }
    };

    request(options, function(err, res, body) {
        if (err) {
            callback(true, 'Server Error');
            return;
        }

        if (Math.floor(res.statusCode / 100) === 3) {
            // console.log('session');
            callback(true, 'Session out');
            return;
        }

        body = iconv.decode(body, "GB2312").toString();
        var $ = cheerio.load(body);
        var tr = $('#DataGrid1').find('tr');
        var result = [];

        for (var i = 0; i < tr.length - 1; i++) {
            var td = tr.eq(1 + i).find('td');
            var res = {
                classId: td.eq(0).text(),
                className: td.eq(1).text(),
                name: td.eq(2).text(),
                room: td.eq(3).text(),
                seat: td.eq(4).text(),
                style: td.eq(6).text() === "&nbsp;" ? "" : td.eq(7).text()
            };
            result.push(res);
        }
        // console.log(result);
        callback(false, result);
    });
};

module.exports = makeUp;