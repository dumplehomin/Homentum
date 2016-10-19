"use strict";
var Delay_fn = require("../delay_fn");

var Clock = require("./clock");
var Weather = require("./weather");
var News = require("./news");
var Link = require("./links");
var Todo = require("./todo");
var News = require("./news");
var Setting = require("./setting");

var _$loading = _$.query(".loading");
var _$content = _$.query(".content_container");
var _$bg = _$.query(".background");
var _$body = _$.query("body");

var show_container;
var _$links_widget;
var _$search_widget;
var _$todo_widget;
var _$setting_widget;
var _$news_widget;
var _$setting_list;
var _$setting_password;
var _$search_txt;
var _$search_select;
var _$news_list;
var _$todo_title;

var widget = [];
widget.push( Clock );
widget.push( Weather );
widget.push( Link );
widget.push( Todo );
widget.push( News );
widget.push( Setting );


var _this = module.exports = {
	"start" : function(){
		widget.forEach(function( _widget, index ){
			_widget();
		});

		_this.widget_load_check();
	}, 
	"widget_load_check" : function(){
		Delay_fn.set(function(){
			var load_widget = _$.queryAll(".widget", _$content);

			if( load_widget.length !== widget.length ){
				_this.widget_load_check();
			}else {
				for( var t = 0; t < load_widget.length; t++ ){
					var _widget_bool = load_widget[t].classList.contains("on");
					if( !_widget_bool ){
						_this.widget_load_check();
						return;
					}
				}

				if( !_$bg.classList.contains("on") ){
					_this.widget_load_check();
					return;
				}

				_this.widget_load_complete();
			}
		}, 1000);
	},
	"widget_load_complete" : function(){
		$.data( _$loading, "$this").fadeOut("fast", function(){
			_$content.classList.add("on");
		});

		_$links_widget = _$.query(".links_widget");
		_$search_widget = _$.query("#search");
		_$todo_widget = _$.query(".todo_widget");
		_$setting_widget = _$.query(".setting_widget");
		_$news_widget = _$.query(".news_widget");
		_$setting_list = _$.queryAll(".setting_li");
		_$setting_password = _$.query(".setting_password");
		_$search_txt = _$.query(".search_txt", "#search");
		_$search_select = _$.query(".search_select");
		_$news_list = _$.query(".news_list");
		_$todo_title = _$.query(".todo_title");

		bodyFocusEvent();
	}
}

function bodyFocusEvent(){
	var body_focus = false;

_$.eventsOn( _$body, "focus", function(){
	body_focus = true;
	show_container = _$.queryAll( ".show", _$content );

	if( show_container.length !== 0 ){
		_$.each(show_container, function(_wid, index){
			_wid.classList.remove("show");
		});
	}

	if( _$news_list.classList.contains("on") ){
		_$news_list.classList.remove("on");
	}
});

_$.eventsOn( _$body, "blur", function( event ){
	body_focus = false;
});

_$.eventsOn( _$body, "keydown", function( event ){
	if( body_focus ){
		show_container = _$.queryAll( ".show", _$content );

		switch( event.keyCode ){
			case 84 :
				_$todo_widget.classList.add("show");
				_$todo_title.focus();
				event.preventDefault();
			break;
			case 76 :
				_$links_widget.classList.add("show");
				_$links_widget.focus();
			break;
			case 188 :
				for( var t = 0; t < _$setting_list.length; t++ ){
					if( _$setting_list[t].classList.contains("show") ){
						_$setting_list[t].classList.remove("show");
						break;
					}
				}
				_$setting_widget.classList.add("show");
				_$setting_password.classList.add("show");
				_$setting_widget.focus();
			break;
			case 83 :
				_$search_txt.focus( true );
				_$search_widget.classList.add("on");
				_$search_select.classList.add("on");
				event.preventDefault();
			break;
		}
	}
});

}


























