"use strict";
var news_load = require("../ajax/ajax");
var Delay_fn = require("../delay_fn");
// var new_url = "http://www.hani.co.kr/rss/";
var news_url = "http://www.hani.co.kr/rss/";
var news_html_url = "module/widget/news.html";

var _$content = _$.query(".content_container");
var _$news_widget;
var _$news_sliding;
var _$sliding_li_height;
var append_height = 0;

module.exports = function(){
	news_load.html( news_html_url, newsSetting );
}

function newsSetting( data ){
	_$content.insertAdjacentHTML( "beforeend", data );
	_$news_widget = _$.query(".news_widget");

	_$news_widget.classList.add("on");

	_$news_sliding = _$.query(".news_sliding");

	news_load.jsonp( "https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&num=10&q=http://www.hani.co.kr/rss/", newsCall );
}

function newsCall( data ){
	var news = data.responseData.feed.entries;
	var news_array = [];

	_$.each( news, function( _news, index ){
		var _$li = document.createElement("li");
		news_array.push( _news );
		_$li.textContent = _news.title;
		_$news_sliding.appendChild( _$li );
	});

	_$sliding_li_height = parseInt(_$.css(_$.query( "li", _$news_sliding ), "height")) * -1;
	append_height = _$sliding_li_height * 2;

	newsSliding();
	// for( var t = 0; t < news.length; t++ ){
	// 	// console.log( news[t] );
	// 	// console.log( news[t].title );
	// 	// console.log( news[t].link );
	// 	// console.log( news[t].publishedDate );
	// 	// console.log( news[t].contentSnippet );
	// 	var test = new Date( news[t].publishedDate );
	// 	console.log( test );
	// }
}

function newsSliding(){
	var current_top = parseInt(_$.css(_$news_sliding, "top"));
	var moving_height = current_top + _$sliding_li_height;

	if( current_top === append_height ){
		// console.dir( _$news_sliding );
		// console.log( _$news_sliding.firstChild );
		_$news_sliding.appendChild(_$news_sliding.firstChild);
		// _$.css( _$news_sliding , "top", current_top + ( _$sliding_li_height*3 ) );
		_$.css( _$news_sliding , "top", current_top - _$sliding_li_height + "px" );
		// current_top = _$.css( _$news_sliding , "top" );
		// moving_height = current_top;
		// _$.css( _$news_sliding, "top", moving_height + "px" );
	}else {
		_$.css( _$news_sliding, "top", moving_height + "px" );

		Delay_fn.set( newsSliding, 3000 );
	}
}

// function xmlCallSuccess( xml ){
// 	console.log( xml );
// 	// xml = xml.childNodes[0].childNodes[0].childNodes;
// 	// for( var t = 0; t < xml.length; t++ ){
// 	// 	console.log( xml[t].childNodes[0] );
// 	// }
// }

