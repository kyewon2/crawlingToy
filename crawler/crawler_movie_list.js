/**
 * Created by k_bluehack on 2016. 9. 27..
 */

var request = require("request");
var cheerio = require("cheerio");   //html 태그 가져오는 npm 라이브러리
var dbPool = require("./dbPool.js");

exports.parseMovie = function () {

    var areacode = '01'; //01=서울
    var theaterCode = '0191'; // 0191=홍대
    var date = '20161006';
    var url = 'http://www.cgv.co.kr/common/showtimes/iframeTheater.aspx?areacode='+areacode+'&theatercode='+theaterCode+'&date='+date;

    var titles = [];
    var ageLimits = [];
    var isCheckScreens = [];
    var d_days = [];
    var sub_info_movies = [];
    var genres = [];
    var runningTimes = [];
    var releaseDates = [];

    var hall_infos = [];
    var displays = [];
    var locations = [];
    var seats = [];

    var hall_timetables = [];
    var timetables = [];
    var screen_links = [];
    var screen_times = [];
    var screen_seats = [];

    var count = 0;

    var movieHash = {};

    request(url, function(error, response, body){
        if (error) {throw error};

        var $ = cheerio.load(body);
        var root = $("div[class='col-times']");
        var node_titles = $("li div[class='col-times'] div[class='info-movie'] a[href] strong");
        var node_ageLimits = $("div[class='col-times'] div[class='info-movie'] span").filter('.ico-grade');
        var node_isCheckScreens = $("div[class='info-movie'] span[class] em");
        var node_sub_info = $("div[class='info-movie'] i");

        var sub_root = $("div[class='col-times'] div[class='type-hall']");
        var node_hall_info = $("div[class='info-hall'] ul li");
        var node_timetable_info = $("div[class='info-timetable'] ul li");
        var node_timetable_link = $("div[class='info-timetable'] ul li a[href]");
        var node_timetable_time = $("div[class='info-timetable'] ul li a[href] em");
        var node_timetable_seat = $("div[class='info-timetable'] ul li a[href] span").filter('.txt');

        for (count = 0; count <root.length; count ++) {

            titles.push($(node_titles[count]).text().replace("\n","").trim());
            ageLimits.push($(node_ageLimits[count]).text().replace("\n","").trim());
        }

        //상영 여부
        var isCheck = 0;
        for(count = 0; count < node_isCheckScreens.length; count++) {
            if (count % 2 == 0)
                isCheckScreens.push($(node_isCheckScreens[count]).text().replace("\n","").trim());

            isCheck++;
            if (isCheck % 2 == 0)
                d_days.push($(node_isCheckScreens[count]).text().replace("\n","").trim());
        }

        //cgv 태그 특성상 장르/플레이시간/개봉일 정보
        node_sub_info.each(function () {
            sub_info_movies.push($(this).text().replace("\n","").replace("개봉","").trim());
        });

        //영화 장르
        for (count = 0; count < sub_info_movies.length; count = count + 3) {
            if (sub_info_movies[count] != null)
                genres.push(sub_info_movies[count].toString());
        }

        //상영 시간
        for (count = 1; count < sub_info_movies.length; count = count + 3) {
            if (sub_info_movies[count] != null)
                runningTimes.push(sub_info_movies[count].toString());
        }

        //개봉일
        for (count = 2; count < sub_info_movies.length; count = count + 3) {
            if (sub_info_movies[count] != null)
                releaseDates.push(sub_info_movies[count].toString());
        }

        //상영 영화관 정보
        node_hall_info.each(function () {
            hall_infos.push($(this).text().replace("\r\n","").trim().replace("총                                                        ",""));
        });

        //2d, 3d, 4d 여부
        for(count = 0; count < hall_infos.length; count = count + 3) {
            if (count % 2 == 0)
                displays.push(hall_infos[count].toString());
        }

        //상영관
        for(count = 1; count < hall_infos.length; count = count + 3) {
            if (count % 2 == 0)
                locations.push(hall_infos[count].toString());
        }

        //좌석수
        for(count = 2; count < hall_infos.length; count = count + 3) {
            if (count % 2 == 0)
                seats.push(hall_infos[count].toString());
        }

        for (count = 0; count < root.length; count ++) {
            for (var i = 0; i < sub_root.length; i ++) {
                timetables.push([node_timetable_time.get(i).children[0].data]);
            }
            hall_timetables.push(timetables[count]);
        }

        /*
        //좌석수 관련 정보 가져오는 테스트
        console.log($(root[3]).find('.info-timetable').length); //한 영화의 장소에 따른 좌석 수
        var test = $("div[class='info-timetable']");
        var test2 = $("ul li em");

        var rr = $(test[3]).find('li');
        //var rr = $(test[0]).find('em');

        var dd = $(root[3]).find('.info-timetable');
        var rr2 = rr + $(test2).text();
        console.log(rr2);*/

        /*console.log(sub_root.length);
        console.log(node_timetable_time.get(2).children);
        for (var j =0; j < hall_timetables.length; j ++) {
            console.log(hall_timetables[j]);
        }*/

        /*console.log(titles);
        console.log(ageLimits);
        console.log(isCheckScreens);
        console.log(d_days);
        console.log(genres);
        console.log(runningTimes);
        console.log(releaseDates);*/

        /*console.log(displays);
        console.log(locations);
        console.log(seats);*/

        movieHash['title'] = titles;
        movieHash['ageLimit'] = ageLimits;
        movieHash['isCheckScreen'] = isCheckScreens;
        movieHash['d_day'] = d_days;
        movieHash['genre'] = genres;
        movieHash['runningTime'] = runningTimes;
        movieHash['releaseDate'] = releaseDates;

        dbPool.insert(movieHash);

    });

};
