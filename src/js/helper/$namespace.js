"use strict";
var _this = global;

var $namespace = function( _ns_str ){
	if( typeof _ns_str !== "string" ){
		throw new Error("전달인자는 문자 유형만 가능합니다.");
	}

	var ns_arr = _ns_str.split(".");
	var _namespace;

	ns_arr.forEach(function( _ns, _index ){
		if( _index === 0 ){
			if( Object.prototype.toString.call( _this[ _ns ]) !== "[object Object]" ){
				_this[ _ns ] = {};
			}

			_namespace = _this[ _ns ];
		}else {
			if( Object.prototype.toString.call( _namespace[ _ns ]) !== "[object Object]" ){
				_namespace[ _ns ] = {};
			}

			_namespace = _namespace[ _ns ];
		}
	});

	return _namespace;
}

global.$namespace = $namespace;