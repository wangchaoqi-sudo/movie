var express = require('express');
var path = require('path')
var router = express.Router();
var mysqltool = require('./mysql')
var multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'))
    },
    filename: function (req, file, cb) {
        var ext = (file.originalname).split('.')
        cb(null, file.fieldname + '-' + Date.now() + '.' + ext[ext.length - 1])
    }
})
var upload = multer({storage: storage})
var connection = mysqltool.getconnection()
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('admin', {title: 'Express'});
});

router.get('/select', function (req, res, next) {
    console.log(new Date())
    var page = req.query.page
    var limit = req.query.limit
    var sql1 = "select count(*) as total from movieinfo "
    var sql2 = "select movieid,moviename,releasetime,director,leadactors,picture from movieinfo limit " +
        (page - 1) * limit + ',' + limit;
    var total;

    var promise = new Promise(function (resolve, reject) {
        connection.query(sql1, function (err, rows) {
            if (err) throw err
            resolve(rows[0].total)
        })

    })

    promise.then(function (value) {

        total = value
        var promise = new Promise(function (resolve, reject) {
            connection.query(sql2, [], function (err, rows) {
                if (err) throw err
                resolve(rows)
            })
        })


        promise.then(function (value) {
            res.send(
                {
                    "code": 0,
                    "msg": "",
                    "count": total,
                    "data": value
                })
        })

//第一个promise
    })
//route 结束
})


router.post('/insert', function (req, res) {
    var movieid = req.body.movieid
    var moviename = req.body.moviename
    var releasetime = req.body.releasetime
    var director = req.body.director
    var leadactors = req.body.leadactors
    var description = req.body.description
    var picture = req.body.picture
    var data = [movieid, moviename, releasetime, director, leadactors, description, picture]
    console.log(data)
    var sql = "insert into movieinfo(movieid,moviename,releasetime,director,leadactors,description,picture) " +
        "values(?,?,?,?,?,?,?)"
    var sql2 = "insert into mymovie(movieid,moviename,releasetime,director,leadactors,description,picture) " +
        "values(?,?,?,?,?,?,?)"
    connection.query(sql, data, function (err, rs) {
        if (err) throw err
        else {
            connection.query(sql2, data, function (err, rs) {
                if (err) throw err
            })
        }


    })
    res.send();
})


router.post('/delete', function (req, res) {
    var movieid = req.body.movieid;
    console.log(movieid)
    var sql = "delete from movieinfo where movieid=?"
    var sql2 = "delete from mymovie where movieid=?"
    connection.query(sql, movieid, function (err, rows) {
        if (err) throw err;
        else {
            connection.query(sql2, movieid, function (err, rows) {
                if (err) throw err
            })
        }

    })
    res.send();
})


router.post('/upload', upload.single('movie'), function (req, res) {
    res.send({
        "code": 0,
        "msg": "",
        "data": {
            "src": "../../../public/uploads/" + req.file.filename
        }
    })
})

router.get('/selectuser', function (req, res) {
    var page = req.query.page
    var limit = req.query.limit
    var sql = "select count(*) as total from user "
    var sql1 = 'select * from user  limit ' + (page - 1) * limit + ',' + limit;
    var total;

    var promise = new Promise(function (resolve, reject) {
        connection.query(sql, [], function (err, rows) {
            if (err) throw err
            resolve(rows[0].total)
        })
    })
    promise.then(function (value) {
        total = value
        var promise = new Promise(function (resolve, reject) {
            connection.query(sql1, [], function (err, rows) {
                if (err) throw err
                resolve(rows)
            })
        })
            promise.then(function (value) {
                res.send(
                    {
                        "code": 0,
                        "msg": "",
                        "count": total,
                        "data": value
                    })
            })
        })
    })



    router.post('/updatestatus',function (req,res) {
        var userid=req.body.userid
        var status=req.body.status
        var sql = 'update user set status=? where userid=?'
        connection.query(sql,[status,userid],function (err,rows) {
            if (err) throw err
        })
        res.send();
    })
    module.exports = router;