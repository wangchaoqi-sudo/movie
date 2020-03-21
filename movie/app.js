var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyparser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var movieRouter = require('./routes/movierecommend')
var adminRouter = require('./routes/admin')

var app = express();

//使用express-art-template模板引擎
app.set('view engine', 'html');
app.engine('html', require('express-art-template'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));  //装载正文解析必须在router前
app.use(cookieParser());
app.use('/public/',express.static(path.join(__dirname, 'public')));
app.use('/node_modules/',express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/movies',movieRouter)
app.use('/admin',adminRouter)

module.exports = app;
