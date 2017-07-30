var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var getAllScores = function (data,callback) {
    var options = {
        url : 'http://222.24.62.120/xscjcx.aspx?xh=' + data.username + '&xm=' + encodeURI(data.name) + '&gnmkdm=N121605',
        method : 'GET',
        encoding : null,
        headers : {
            Referer : 'http://222.24.62.120/xscjcx.aspx?xh=' + data.username,
            Cookie : data.session
        }
    };
    
    request(options,function (err,res,body) {
        if (err){
            callback("Server Error",err);
            return;
        }
        if (Math.floor(res.statusCode/ 100) === 3){
            callback("Session Out",err);
            return;
        }

        var body = iconv.decode(body,"GB2312").toString();

        if(body.indexOf('你还没有进行本学期的课堂教学评价') !== -1){
            callback(true,"Need Assess");
            return;
        }

        var $ = cheerio.load(body);
        var viewstate = $('input[name="__VIEWSTATE"]').val();

        saveAllScores(data,viewstate,callback);
    });
};

var saveAllScores = function (data,viewstate,callback) {
    var formData = {
        __EVENTTARGET: '',
        __EVENTARGUMENT: '',
        __VIEWSTATE: viewstate,
        hidLanguage: '',
        ddlXN: '',
        ddlXQ: '',
        ddl_kcxz: '',
        btn_zcj: '历年成绩'
    };
    var options = {
        url : 'http://222.24.62.120/xscjcx.aspx?xh=' + data.username + '&xm=' + encodeURI(data.name) + '&gnmkdm=N121605',
        method : 'POST',
        encoding : null,
        headers : {
            Referer : 'http://222.24.62.120/xscjcx.aspx?xh=' + data.username + '&xm=' + encodeURI(data.name) + '&gnmkdm=N121605',
            Cookie : data.session
        },
        form : formData
    };

    request(options,function (err,res,body) {
       if(err){
           callback("Server Error",err);
           return;
       }
       if(Math.floor(res.statusCode / 100) === 3){
           callback("Session Out",err);
           return;
       }

       var body = iconv.decode(body,"GB2312").toString();
       var $ = cheerio.load(body);

       var tr = $('#Datagrid1').find('tr');
       var result = [];

       for(var i = 0; i < tr.length - 1; i ++){
           var td = tr.eq(i + 1).find('td');
           var res = {
               'year' : td.eq(0).text(),
               'semester' : td.eq(1).text(),
               'courseTitle' : td.eq(3).text(),
               'courseType' : td.eq(4).text(),
               'credit' : td.eq(6).text(),
               'gradePoint' : td.eq(7).text(),
               'achievement' : td.eq(8).text(),
               'makeupScore' : td.eq(10).text(),
               'rebuiltScore' : td.eq(11).text(),
               'institution' : td.eq(12).text()
           };

           result.push(res);
       }
       console.log(result);
        callback(false,result);
    });
};

module.exports = getAllScores;
