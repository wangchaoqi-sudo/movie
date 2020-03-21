var express = require('express');
var router = express.Router();
const spawnSync = require('child_process').spawnSync;
var mysqltool = require('./mysql')
/* GET home page. */
var connection = mysqltool.getconnection()
router.get('/recommend', function (req, res, next) {
    var username = req.query.username;
    var password = req.query.password;
    console.log(username + '     ' + password)
    var selectMovieInfoSQLsql = "select movieid,moviename,picture from movieinfo limit 1000";
    var movieinfolist = [];
    connection.query(selectMovieInfoSQLsql, [], function (err, rows, fields) {
        if (err) throw err;
        movieinfolist = rows
    });
    var selectSQL = "select * from user where username = ? and password = ?";
    connection.query(selectSQL, [username, password], function (err, rows, fields) {
        if (err) throw  err;

        function radomFrom(lowerValue, upperValue) {
            return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
        }

        var lowerValue = 0;
        var upperValue = movieinfolist.length
        var index = radomFrom(lowerValue, upperValue)
        var movielist = [];
        var movieNumbers = 4;
        for (var i = 0; i < movieNumbers; i++) {
            index = radomFrom(lowerValue, upperValue)
            movielist.push({
                movieid: movieinfolist[index].movieid,
                moviename: movieinfolist[index].moviename,
                picture: movieinfolist[index].picture
            });
        }
        console.log(movielist)
        res.render('index', {
            title: 'welcome user',
            userid: rows[0].userid,
            username: rows[0].username,
            username2: username,
            password: password,
            movieforpage: movielist
        });
    });

});


router.post('/submituserscore', function (req, res) {
    var userid = req.body.userid;
    var moviescores = [];
    var movieids = [];
    req.body.moviescore.forEach(function (score) {
        moviescores.push({moviescore: score});
    });
    req.body.movieid.forEach(function (id) {
        movieids.push({movieid: id});
    });
    connection.query('delete from personalratings where userid=?', userid, function (err, result) {
        if (err) throw err;
        console.log('deleted');
    });

    //生成评分时间戳
    var mytimestamp = new Date().getTime().toString().slice(1, 10);
    //把每条评分记录（userid，movieid，rating，timestamp）插入数据库
    for (var item in movieids) {
        var personalratings = {
            userid: userid,
            movieid: movieids[item].movieid,
            rating: moviescores[item].moviescore,
            timestamp: mytimestamp
        };
        connection.query('insert into personalratings set ?', personalratings, function (err, rs) {
            if (err) throw err;
            console.log('inserct into personalrating success');
        });
    }

    var selectUserIdNameSQL = 'select userid,username from user where userid = ?';
    connection.query(selectUserIdNameSQL, userid, function (err, rows, fields) {
        if (err) throw err;
        console.log(rows)
        res.render('d', {title: 'Personal Rating success', user: rows[0]});

    });
})


//调用spark为用户推荐 并写入数据库


router.get('/recommendmovieforuser', function (req, res) {
    const userid = req.query.userid;
    const username = req.query.username;
    const path = '/movie_recommend'
let spark_sumit = spawnSync('/home/spark/spark-2.1.0-bin-without-hadoop/bin/spark-submit',['--class',
'recommend.MovieLensALS','/home/movierecommend.jar',path,userid],{shell:true,encoding: 'utf8'});


    var sql = "select recommendresult.userid,recommendresult.movieid,recommendresult.rating" +
        ",recommendresult.moviename,movieinfo.picture from recommendresult inner join movieinfo  " +
        "on recommendresult.movieid=movieinfo.movieid where recommendresult.userid =?"
    var sql2 = 'select  movieid, moviename, DATE_FORMAT(releasetime,"%Y-%m-%d") as releasetime, director, leadactors, picture, description, createtime from mymovie where date_sub(curdate(),interval 7 day) < date(createtime)  ' +
        'order by id desc limit 5';

    var movieinfolist = [];
    var movie;

    var promise = new Promise(function (resolve, reject) {


        connection.query(sql, userid, function (err, rows, fields) {
            if (err) throw err;
            console.log('read recommend result');
            for (var i = 0; i < rows.length; i++) {
                console.log('forxunhuan:i=' + i);
                movieinfolist.push({
                    userid: rows[i].userid,
                    movieid: rows[i].movieid,
                    rating: rows[i].rating,
                    moviename: rows[i].moviename,
                    picture: rows[i].picture
                })
            }
            resolve(rows)

        })

    })
        promise.then(function (value) {

            var promise = new Promise(function (resolve, reject) {
                connection.query(sql2,[],function (err,rows) {
                    if (err) throw err
                    resolve(rows)
                })
            })
          promise.then(function (value) {
              movie=value
              console.log(movie)
              res.render('recommendresult', {
                  title: 'recommend result', message: 'this is recommmend for you',
                  username: username, movieinfo: movieinfolist,movie:movie
              })

          })

        })




});
module.exports = router;