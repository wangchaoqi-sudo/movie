var express = require('express');
var router = express.Router();
var mysqltool = require('./mysql')
var connection = mysqltool.getconnection();
var sql;
/* GETusers listing. */
router.get('/', function (req, res, next) {
    res.render('login', {title: 'Express'});
});

router.post('/insert', function (req, res, next) {
    var username=req.body.username;
    var password=req.body.password;
    var phone=req.body.phone;
    console.log(username,password,phone)

    sql='insert into user(username,password,phone) values (?,?,?)'
    connection.query(sql,[username,password,phone],function (err,rs) {
        if(err) throw err;
        res.render('index',{'msg':'success'})
    })
});

router.get('/delete', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/update', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/select', function (req, res, next) {
    var data = []
    var username = req.body.username;
    var password = req.body.password;
    sql = "select * from user where username = ? and password = ?";
    connection.query(sql, [username, password], function (err, rs) {
        if (err) throw err;

        if (rs != '')
            data = [rs, {'msg': 'success'}]
        else
            data = [rs, {'msg': 'failure'}]
        res.send(data);
    })
});



router.get('/total',function (req,res) {
    sql= 'select count(*) as total from user  '
    connection.query(sql,[],function (err,rows) {
        if (err) throw err
        res.send(rows[0])
    })
})
module.exports = router;
