"use strict";
var news_load = require("../ajax/ajax");
var Delay_fn = require("../delay_fn");
// var new_url = "http://www.hani.co.kr/rss/";
var news_url = "http://www.hani.co.kr/rss/";
var news_html_url = "module/widget/news.html";

var _$content = _$.query(".content_container");
var _$news_widget;
var _$news_sliding;
var _$news_list;
var _$sliding_li_height;
var append_height = 0;
var _$loading = _$.query(".loading");

module.exports = function(){
	news_load.html( news_html_url, newsSetting );
}

function newsSetting( data ){
	_$content.insertAdjacentHTML( "beforeend", data );
	_$news_widget = _$.query(".news_widget");

	_$news_widget.classList.add("on");

	_$news_sliding = _$.query(".news_sliding");
	_$news_list = _$.query(".news_list");

	_$.eventsOn( _$news_sliding, "click", function( event ){
		_$news_list.classList.add("on");
		_$news_list.firstChild.firstChild.focus();
	});

	news_load.jsonp( "https://ajax.googleapis.com/ajax/services/feed/load?v=2.0&num=10&q=http://www.hani.co.kr/rss/", newsCall );
}

function newsCall( data ){
	var news = data.responseData.feed.entries;

	_$.each( news, function( _news, index ){
		var _$li = document.createElement("li");
		var _$list_li = document.createElement("li");
		var _$a = document.createElement("a");

		_$li.textContent = _news.title;
		_$news_sliding.appendChild( _$li );

		_$a.textContent = _news.title;
		_$a.setAttribute( "href", _news.link );
		_$a.setAttribute( "target", "_blank" );
		_$list_li.appendChild( _$a );
		_$news_list.appendChild( _$list_li );
	});

	_$sliding_li_height = parseInt(_$.css(_$.query( "li", _$news_sliding ), "height")) * -1;
	append_height = _$sliding_li_height * 3;

	startNewsInterval();
}

function startNewsInterval(){
	Delay_fn.set(function(){
		if( _$.css( _$loading, "display" ) === "none" ){
			newsSliding();
		}else {
			startNewsInterval();
		}
	}, 500);
}

function newsSliding(){
	var current_top = parseInt(_$.css(_$news_sliding, "top"));
	var moving_height = current_top + _$sliding_li_height;
	var clone_li = _$news_sliding.firstChild.cloneNode(true);

	_$news_sliding.classList.add("on");
	_$news_sliding.appendChild( clone_li );
	_$.css( _$news_sliding, "top", moving_height + "px" );

	Delay_fn.set( newsSliding, 3000 );
	interval_news();
}

function interval_news(){
	if( _$.css( _$news_sliding, "top") === "-24px" ){
		_$news_sliding.classList.remove("on");
		_$news_sliding.removeChild(_$news_sliding.firstChild);
		_$.css( _$news_sliding, "top", "0px");
	}else {
		Delay_fn.set( interval_news, 500 );		
	}
}



