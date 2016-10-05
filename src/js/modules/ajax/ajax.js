"use strict";

var _this = module.exports = {
	"html" : function( html_url, fn ){
		_this.ajax( html_url, fn, "html" );
	},
	"json" : function( url, fn ){
		_this.ajax( url, fn, "json" );
	},
	"ajax" : function( _url, _fn, _type ){
		$.ajax({
			type: "get",
			url: _url,
			dataType: _type,
			success: _fn
		});
	}
}