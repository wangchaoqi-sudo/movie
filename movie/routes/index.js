var express = require('express');
var router = express.Router();
var mysqltools = require('./mysql')
var connection = mysqltools.getconnection()

/* GET home page. */
router.get('/index', function(req, res, next) {

  var  sql='select  movieid, moviename, DATE_FORMAT(releasetime,"%Y-%m-%d") as releasetime, director, leadactors, picture, description, createtime from mymovie where date_sub(curdate(),interval 7 day) < date(createtime)  ' +
      'order by id desc limit 5';

  promise = new Promise(function (resolve, reject) {
    connection.query(sql,[],function (err,rows) {
      if (err) throw err
      resolve(rows)
    })

  })

  promise.then(function (value) {

    console.log(value)
    res.render('welcome', { title: 'Express',movie:value });
  })


});

router.get('/info',function (req,res) {
 var movieid=req.query.movieid
  var  sql='select  movieid, moviename, DATE_FORMAT(releasetime,"%Y-%m-%d") as releasetime, director, leadactors, picture, description, createtime from mymovie where movieid=?'
 var promise = new Promise(function (resolve, reject) {
    connection.query(sql,movieid,function (err,rows) {
      if (err) throw err
      resolve(rows)
    })

  })

  promise.then(function (value) {
     console.log(value)
    res.render('preview', { title: 'Express',movie:value[0] });
  })


})

module.exports = router;
