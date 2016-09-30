'use strict';
console.log('Loading function');

let dynamoDBUtil = require('./awsdynamodbutil');
var crawler_movie_list = require('./crawler_movie_list.js');

const APP_TAG_VERSION = '1.0.0';

exports.handler = (event, context) => {

    crawler_movie_list.parseMovie(event, context);
}