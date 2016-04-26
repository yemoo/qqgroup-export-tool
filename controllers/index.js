'use strict';

var request = require('request');
var nodeExcel = require('excel-export');

function getBkn(skey) {
    for (var b = skey, a = 5381, c = 0, d = b.length; c < d; ++c) {
        a += (a << 5) + b.charAt(c).charCodeAt();
    }
    return a & 2147483647;
}

function formatString(s) {
    return s.replace(/&nbsp;/g, ' ').replace(/[^\w\d\s\[\]\{\}\,.?"\(\)+_\-*\/\\&\$#^@!~`\u4E00-\u9FA5\uf900-\ufa2d]/g, '');
}

function formatDate(timestamp) {
    var date = new Date(timestamp * 1000);
    return timestamp ? (date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()) : '';
}

module.exports = function(router) {

    router.get('/', function(req, res) {
        res.render('login');
    });

    router.post('/group', function(req, res) {
        var cookies = req.session.cookies = req.body.cookies.trim().replace(/(^"|"$|\s)/g, '');
        var skey = /skey=(.+?);/.test(cookies) && RegExp.$1;
        var qq = req.session.qq = /uin=o0*(\d+)?/.test(cookies) && RegExp.$1;
        var bkn = req.session.bkn = getBkn(skey);

        request({
            url: 'http://qun.qq.com/cgi-bin/qun_mgr/get_group_list?bkn=' + bkn,
            headers: {
                'Cookie': cookies
            }
        }, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                body.qq = qq;
                res.render('group', body);
            } else {
                res.send(error);
            }
        });
    });

    router.get('/user', function(req, res) {
        var cookies = req.session.cookies;
        var bkn = req.session.bkn;
        var download = req.query.download !== undefined;
        var gc = req.query.gc;
        var params = 'bkn=' + bkn + '&gc=' + gc + '&st=0&end=2000&sort=0';

        request({
            url: 'http://qun.qq.com/cgi-bin/qun_mgr/search_group_members?' + params,
            headers: {
                'Cookie': cookies
            }
        }, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                var roleMap = ['超级管理员', '管理员', '成员'];
                if (download) {
                    var conf = {};
                    conf.stylesXmlFile = __dirname + '/styles.xml';
                    conf.cols = [{
                        caption: '成员',
                        type: 'string',
                        width: 50
                    }, {
                        caption: '群名片',
                        type: 'string',
                        width: 60
                    }, {
                        caption: 'QQ号',
                        type: 'string',
                        width: 40
                    }, {
                        caption: '性别',
                        type: 'string',
                        width: 10
                    }, {
                        caption: '角色',
                        type: 'string',
                        width: 40
                    }, {
                        caption: '加入时间',
                        type: 'string',
                        width: 50
                    }, {
                        caption: '最后发言时间',
                        type: 'string',
                        width: 50
                    }];
                    conf.rows = [];
                    // body.mems.length = 27;
                    body.mems.forEach(function(item) {
                        var rowDate = [formatString(item.nick),
                            formatString(item.card),
                            item.uin,
                            item.g == 0 ? '男' : '女',
                            roleMap[item.role],
                            formatDate(item.join_time),
                            formatDate(item.last_speak_time)
                        ];
                        conf.rows.push(rowDate);
                    });
                    //console.log(conf.rows);
                    var result = nodeExcel.execute(conf);
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                    res.setHeader('Content-Disposition', 'attachment; filename=user-list-' + gc + '.xlsx');
                    res.end(result, 'binary');
                } else {
                    res.send(body);
                }
            } else {
                res.send(error);
            }
        });
    });
};
