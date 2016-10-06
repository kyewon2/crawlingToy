/**
 * Created by k_bluehack on 2016. 10. 5..
 */

var mysql = require('mysql');

var host = 'localhost';
var port = '3306';
var user = 'root';
var password = '';
var database = 'cgv';

exports.insert = function (cgvData) {

    console.log('#Start connect db');

    var values = [];
    for (var i = 0; i < cgvData.title.length; i ++) {
        values.push([cgvData.title[i],cgvData.ageLimit[i],cgvData.isCheckScreen[i],cgvData.d_day[i], cgvData.genre[i], cgvData.runningTime[i], cgvData.releaseDate[i]]);
    }
    console.log(values);

    var connection = mysql.createConnection({
        host: host,
        port: port,
        user: user,
        //password: password,
        database: database
    });

    connection.connect();

    connection.query("INSERT INTO movie (title, ageLimit, isCheckScreen, d_day, genre, runningTime, releaseDate) VALUES ?", [values], function (err) {

        if (err)
            console.log(err);

    });
    connection.end();
};