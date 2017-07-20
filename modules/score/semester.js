var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var getSemScores = function (data,callback) {
    var options = {
        url : 'http://222.24.62.120/xscjcx.aspx?xh=' +　data.username + '&xm=' + encodeURI(data.name) + '&gnmkdm=N121605',
        method : 'GET',
        encoding : null,
        headers : {
            Referer : 'http://222.24.62.120/xs_main.aspx?xh=' + data.username,
            Cookie : data.session
        }
    };

    request(options,function (err,res,body) {
        if(err){
            callback("Server Error",err);
            return;
        }
        if(Math.floor(res.statusCode/100) === 3){
            callback("Session Out",err);
            return;
        }

        var body = iconv.decode(body,"GB2312").toString();
        // console.log(body);
        if(body.indexOf("你还没有进行本学期的课堂教学质量评价") !== -1)
        {
            callback("Need Assess");
            return;
        }
        var $ = cheerio.load(body);
        var viewstate = $("input[name='__VIEWSTATE']").val();

        // console.log(viewstate);

        saveSemScores(data,viewstate,callback)
    });
}

var saveSemScores = function (data,viewstate,callback) {
    var formData = {
        __EVENTTARGET : '',
        __EVENTARGUMENT : '',
        __VIEWSTATE : 'viewstate',
        hidLanguage : '',
        ddlXN : 'data.year',
        ddlXQ : 'data.semester',
        ddl_kcxz : '',
        btn_zcj : '学期成绩'
    };
    var options = {
        url : 'http://222.24.62.120/xscjcx.aspx?xh=' + data.username + '&xm=' + data.name + '&gnmkdm=N121605',
        method : 'POST',
        encoding : null,
        form : formData,
        headers : {
            Referer : 'http://222.24.62.120/xscjcx.aspx?xh=' + data.username + '&gnmkdm=N121605',
            Cookie : data.session
        }
    };

    request(options,function (err,res,body) {
        if(err){
            callback("Server Error",err);
            return;
        }
        if(Math.floor(res.statusCode/100) === 3){
            callback("Session Out",err);
            return;
        }

        var body = iconv.decode(body,"GB2312").toString();
        var $ = cheerio.load(body);

        var tr = $('#Datagrid1').find('tr');
        console.log(tr);
//         find()方法返回传入一个测试条件(函数)符合条件的数组第一个元素。
//         find()方法为数组中的每个元素都调用一次函数执行：
//              当数组中的元素在测试条件时返回true时,find()返回符合条件的元素,之后的值不会再调用执行函数。
//              如果没有符合条件的元素返回undefined
//         注意: find()对于空数组,函数是不会执行的。
//         注意: find()并没有改变数组的原始值。

        var result = [];

        for(var i = 0;i < tr.length-1;i++){
            //$(selector).eq(index)
            //JQuery的遍历方法，eq()方法返回带有被选元素的指定索引号的元素。
            var td = tr.eq(i+1).find('td');
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
        callback(false,result);
    });
};

module.exports = getSemScores;
