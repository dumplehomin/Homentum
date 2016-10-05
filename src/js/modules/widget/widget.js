"use strict";
var Delay_fn = require("../delay_fn");

var Clock = require("./clock");
var Weather = require("./weather");
var News = require("./news");
var Link = require("./links");
var Todo = require("./todo");
var Setting = require("./setting");

var _$loading = _$.query(".loading");
var _$content = _$.query(".content_container");
var _$bg = _$.query(".background");
var _$body = _$.query("body");

var widget = [];
widget.push( Clock );
widget.push( Weather );
widget.push( Link );
widget.push( Todo );
widget.push( Setting );
// widget.push( News );


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

		bodyFocusEvent();
	}
}

function bodyFocusEvent(){

_$.eventsOn( _$body, "focus", function(){
	var show_container = _$.queryAll( ".show", _$content );
	if( show_container.length !== 0 ){
		_$.each(show_container, function(_wid, index){
			_wid.classList.remove("show");
		});
	}
});

}