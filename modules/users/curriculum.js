var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var curriculum = function(data, callback) {

    var options = {
        url: 'http://222.24.62.120/xskbcx.aspx?xh=' + data.username + '&xm=' + encodeURI(data.name) + '&gnmkdm=N121603',
        method: 'GET',
        headers: {
            Referer: 'http://222.24.62.120/xs_main.aspx?xh=' + data.username,
            Cookie: data.session,
        }
    }

    request(options, function(err, res, body) {
        if(err) {
            callback(true, 'Server Error!');
            return;
        }

        if(Math.floor(res.statusCode / 100) === 3) {
			console.log('session');
			callback(true, 'Session Out!');
			return;
        }
        
        body = iconv.decode(body, "GB2312").toString();

        var $ = cheerio.load(body, {
            decodeEntities: false
        });

        var viewstate = $('input[name="__VIEWSTATE"]').val();

        if(data.check === 'true') {
            setYearSem(data, viewstate, callback);
        } else {
            var inputValue = {
                year: [],
                semester: []
            };

            var option1 = $('#xnd').find('option');
            var option2 = $('#xqd').find('option');

            for(var i = 0, len = option1.length; i < len; i++) {
                inputValue.year.push(option1.eq(i).val());
            }

            for(var i = 0, len = option2.length; i < len; i++) {
                inputValue.semester.push(option2.eq(i).val());         
            }

            callback(false, inputValue);
        }
    });
};

var setYearSem = function(data, viewstate, callback) {
    var formData = {
        __EVENTTARGET: xnd,
        __EVENTARGUMENT: '',
        __VIEWSTATE: viewstate,
        xnd: data.year,
        xqd: data.semester
    };

    var options = {
        url: 'http://222.24.19.201/xskbcx.aspx?xh=' + data.username + '&xm=' + encodeURI(data.name) + '&gnmkdm=N121603',
        method: 'POST',
        encoding: null,
        headers: {
            Referer: 'http://222.24.19.201/xskbcx.aspx?xh=' + data.username + '&xm=' + encodeURI(data.name) + '&gnmkdm=N121603',
            Cookie: data.session,
        },
        form: formData
    };

    request(options, function(err, res, body) {
        if(err) {
            callback(true, 'Server Error!');
            return;
        }

        if(Math.floor(res.statusCode / 100) === 3) {
            callback(true, "Session Out!");
            return;
        }

        body = iconv.decode(body, "GB2312").toString();

        var $ = cheerio.load(body, {decodeEntities: false});

        var res = [];

        var tr = $('#Table1').find('tr');

        console.log(tr);

        for(var i = 0; i < 5; i++) {
            var cur = {
                time: i+1,
                classes: []
            };

            cur.classes.push(dataResult(tr.eq(2).find('td').eq(2 + i).html()));
			cur.classes.push(dataResult(tr.eq(4).find('td').eq(1 + i).html()));
			cur.classes.push(dataResult(tr.eq(6).find('td').eq(2 + i).html()));
			cur.classes.push(dataResult(tr.eq(8).find('td').eq(1 + i).html()));
			res.push(cur);
        }

        callback(false, res);
    });
};

function dataResult(text) {
	var data = text.split('<br>');
	var obj = {};

	if (data.length > 1) {
		obj = {
			className: data[0],
			teacherName: data[2],
			classRoom: data[3]
		};
	}

	if (data.length > 5) {
		obj = {
			className: data[4],
			teacherName: data[6],
			classRoom: data[7]
		};
	}

	return obj;
}

module.exports = curriculum;