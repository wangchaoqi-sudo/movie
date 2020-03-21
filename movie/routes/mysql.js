var mysql = require('mysql');


 exports.getconnection = function (){
    var connection =mysql.createConnection({
         host: 'wangchaoqi01',
         user: 'root',
         password: 'root',
         database: 'movierecommend',
         port: '3306',
         // multipleStatements: true
    });
     connection.connect()
     return connection
 }



