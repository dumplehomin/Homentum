"use strict";
var news_load = require("../ajax/ajax");
// var new_url = "http://www.hani.co.kr/rss/";
var new_url = "http://www.hani.co.kr/rss/";

module.exports = function(){

$.ajax({
  type: "GET",
  url: "https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&num=10&q=http://www.hani.co.kr/rss/",
  dataType: "jsonp",
  crossDomain: true,
  jsonp: "callback",
  success: function (json) {
  	console.log(json);
  }
});

}

// function xmlCallSuccess( xml ){
// 	console.log( xml );
// 	// xml = xml.childNodes[0].childNodes[0].childNodes;
// 	// for( var t = 0; t < xml.length; t++ ){
// 	// 	console.log( xml[t].childNodes[0] );
// 	// }
// }

