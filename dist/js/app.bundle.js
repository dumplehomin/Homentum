(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
require("./helper/$namespace");
require("./helper/utils/_$.type");
require("./helper/utils/_$.each");
require("./helper/utils/_$.query");
require("./helper/utils/_$.css");
require("./helper/utils/_$.string");
require("./helper/utils/_$.event");
//----------------------------------------------------
var _$loading = _$.query(".loading");
$.data( _$loading, "$this", $(".loading") );
//----------------------------------------------------
require("./modules/cookie/cookie_check");
require("./modules/background.js");
require("./modules/storage/user_check.js");
},{"./helper/$namespace":2,"./helper/utils/_$.css":3,"./helper/utils/_$.each":4,"./helper/utils/_$.event":5,"./helper/utils/_$.query":6,"./helper/utils/_$.string":7,"./helper/utils/_$.type":8,"./modules/background.js":10,"./modules/cookie/cookie_check":12,"./modules/storage/user_check.js":18}],2:[function(require,module,exports){
(function (global){
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
"use strict";
var name = $namespace( "_$" );

var getStyle = (function(){
	var _getStyle;

	if( global.getComputedStyle ){
		_getStyle = function( _elNode, _property ){
			return getComputedStyle( _elNode, null )[ _property ];
		}
	}else {
		_getStyle = function( _elNode, _property ){
			return _elNode.currentStyle[ _property ];
		}
	}

	return _getStyle;
})();

function setStyle( _elNode, _property, _value){
	_elNode.style[ _property ] = _value;
}

function css( _elNode, _property, _value) {
	_property = name.toCamel( _property );

	if ( name.isElement( _elNode ) ) {
		if ( _value ) {
			setStyle( _elNode, _property, _value );
		}else {
			return getStyle( _elNode, _property);
		}
	}
}

name.css = css;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
"use strict";
var name = $namespace( "_$" );

function each( _data, _callback ) {
	if ( !_data.length || name.isString( _data ) ) {
		console.error('배열 또는 유사배열 데이터 유형만 처리가 가능합니다.');
	}

	if ( !name.isFunction( _callback ) ) {
		console.error('함수 데이터 유형만 처리가 가능합니다.');
	}

	if ( Array.isArray( _data ) ) {
		_data.forEach( _callback );
	} else {
		[].forEach.call( _data, _callback );
	}
}
name.each = each;
},{}],5:[function(require,module,exports){
(function (global){
"use strict";

var name = $namespace( "_$" );

function checkElement( element_node ){
	if( !element_node || element_node.nodeType !== 1 ){
		throw new Error("전달된 첫번째 인자가 요소노드가 아닙니다");
	}
}

var addEvent = (function(){
	var _addEvent;

	if( global.addEventListener ){
		_addEvent = function( element_node, event_type, callback, capture ){
			checkElement( element_node );
			capture = capture || false;
			element_node.addEventListener( event_type, callback, capture );
		}
	}else if( global.attachEvent ){
		_addEvent = function( element_node, event_type, callback, capture ){
			checkElement( element_node );
			capture = capture || false;
			element_node.attachEvent( "on" + event_type, callback );
		}
	}else {
		_addEvent = function( element_node, event_type, callback, capture ){
			checkElement( element_node );
			capture = capture || false;
			element_node["on" + event_type] = callback;
		}
	}

	return _addEvent;
})();


var removeEvent = (function(){
	var _removeEvent;

	if( global.addEventListener ){
		_removeEvent = function( element_node, event_type, callback, capture ){
			checkElement( element_node );
			capture = capture || false;
			element_node.removeEventListener(event_type, callback, capture);
		}
	}else if( global.attachEvent ){
		_removeEvent = function( element_node, event_type, callback, capture ){
			checkElement( element_node );
			capture = capture || false;
			element_node.detachEvent( 'on'+event_type, callback );
		}
	}else {
		_removeEvent = function( element_node, event_type, callback, capture ){
			checkElement( element_node );
			capture = capture || false;
			element_node[ "on" + event_type ] = null;
		}
	}
	return _removeEvent;
})();

name.eventsOn = addEvent;
name.eventsOff = removeEvent;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
"user strict"
var name = $namespace( "_$" );

function queryAll( _selector, _context) {
	if ( !_context ) {
		_context = document;
	}

	if ( typeof _context === 'string' ) {
		_context = query( _context );
	}

	// context.length 속성 유무에 따라 코드 분기
	if ( _context.length ) {
		// _nodeList는 호이스트 되지만,
		// 아래 코드에서는 큰 문제가 발생하지 않음.
		var _nodeList = [];
		// 헬퍼함수 each 재사용
		each( _context, function( _item ){
		// 마치 2중 for 문처럼 다시 each 함수 사용
			each(query( _selector, _item), function( _item ){
				_nodeList.push( _item );
			});
		});
		// 수집된 _nodeList 반환
		return _nodeList;
	} else {
		// context 객체가 하나일 경우, 간단하게 결과 반환
		return _context.querySelectorAll( _selector );
	}
}

function query( _selector, _context ) {
	return queryAll( _selector, _context)[0];
}

name.queryAll = queryAll;
name.query 	 = query;
},{}],7:[function(require,module,exports){
"use strict";
var name = $namespace( "_$" );

// CSS 문자열을 Javascript에서 처리할 수 있도록 변경
function toCamel( _str ) {
	if ( !name.isString( _str ) ) {
		throw new Error('전달된 인자 값이 문자가 아닙니다.');
	}

	return _str.replace(/-[a-z]/g, function( _$1 ) {
		return _$1.toUpperCase().replace(/-/, '');
	});
}

function toDash( _str ) {
	if ( !name.isString( _str ) ) {
		throw new Error('전달된 인자 값이 문자가 아닙니다.');
	}
	return _str.replace(/[A-Z]|_/g, function( _$1 ) {
		return '-'+_$1.toLowerCase().replace(/_/,'');
	});
}

function toUnderscore( _str ) {
	if ( !name.isString( _str ) ) {
		throw new Error('전달된 인자 값이 문자가 아닙니다.');
	}
	return _str.replace(/[A-Z]|-/g, function( _$1 ) {
		return '_'+_$1.toLowerCase().replace(/-/,'');
	});
}

function trimLeft( _str ) {
	if ( !name.isString( _str ) ) {
		throw new Error('전달된 인자 값이 문자가 아닙니다.');
	}
	return _str.replace(/^\s+/, '');
}

function trimRight( _str ) {
	if ( !name.isString( _str ) ) {
		throw new Error('전달된 인자 값이 문자가 아닙니다.');
	}
	return _str.replace(/\s+$/, '');
}

function trim( _str ) {
	if ( !name.isString( _str ) ) {
		throw new Error('전달된 인자 값이 문자가 아닙니다.');
	}
	return _str.replace(/\s+|\s+$/g, '');
}

// dom 라이브러리로 exports
name.toCamel      = toCamel;
name.toDash       = toDash;
name.toUnderscore = toUnderscore;
name.trim         = trim;
name.trimLeft     = trimLeft;
name.trimRight    = trimRight;
},{}],8:[function(require,module,exports){
var name = $namespace( "_$" );

function type( _data ) {
	// Object.prototype.toString 메소드 빌려쓰기
	return Object.prototype.toString.call( _data ).toLowerCase().slice(8,-1);
}
// type 함수를 재사용하여 결과 값을 true | false로 설정
function isNumber( _data ) {
	return type( _data) === 'number';
}

function isString( _data ) {
	return type( _data ) === 'string';
}

function isBoolean( _data ) {
	return type( _data ) === 'boolean';
}

function isFunction( _data ) {
	return type( _data ) === 'function';
}

function isArray( _data ) {
	return type( _data ) === 'array';
}

function isObject( _data ) {
	return type( _data ) === 'object';
}

function isElement( _data ) {
	return  _data  && ( _data.nodeType === 1 );
}

// dom 네임스페이스 객체의 멤버로 exports
name.type       = type;
name.isNumber   = isNumber;
name.isString   = isString;
name.isBoolean  = isBoolean;
name.isFunction = isFunction;
name.isArray    = isArray;
name.isObject   = isObject;
name.isElement  = isElement;
},{}],9:[function(require,module,exports){
"use strict";

var _this = module.exports = {
	"html" : function( html_url, fn ){
		_this.ajax( html_url, fn, "html" );
	},
	"json" : function( url, fn ){
		_this.ajax( url, fn, "json" );
	},
	"jsonp" : function( _url, _fn ){
		$.ajax({
			type: "GET",
			url: _url,
			dataType: "jsonp",
			crossDomain: true,
			jsonp: "callback",
			success: _fn
		});
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
},{}],10:[function(require,module,exports){
"use strict";
var Store = require("./storage/storage");
var Cookie = require("./cookie/cookie");
var img_load = require("./image_load/images_load");
var img_ajax = require("./ajax/ajax");

var APP_ID = "0fcc3290724a3ffc55d72c6646b6cb6c0dd38986df38f3135656f6bef1443035";
var URL = "https://api.unsplash.com/photos/?client_id=" + APP_ID;

var bg_data = {};
var data_name = "background-image";
var cookie_name = data_name;
var cinema_cookie_name = "cinema";
var current_img_url;
var cinemagraph_json = "./cinemagraph/cinemagraph.json";

var _$background = _$.query(".background");
var _$loading = _$.query(".loading");

//background-image에 대한 쿠키가 없다면
if( !Cookie.get( cookie_name ) ){
	// 쿠키설정 : 값은 비어져 있다. 기간은 0시 기준으로 하루
	// 쿠키 값은 이미지 url	
	Cookie.set( cookie_name, "" ,  "1day");

	// 로컬스토리지에 이미지 정보가 없으면
	if( !Store.get( data_name ) ){
		// 이미지 가져오기
		getBgData();
	}else {
		// 로컬스토리지에 이미지 정보가 있으면
		currentBgUrlSetting( Store.get( data_name ) );
	}
}else {
	if( !Store.get( "user" ) ){
		current_img_url = Cookie.get( cookie_name ).value;
		img_load.load( current_img_url, _$background, _$loading );
	}else {
		if( Store.get( "user" ).cinema ){
			if( Cookie.get( cinema_cookie_name ) ){
				current_img_url = Cookie.get( cinema_cookie_name ).value;
				img_load.load( current_img_url, _$background, _$loading );
			}else {
				// var user_info = Store.get("user");
				// user_info.cinema = false;
				// Store.del("user");
				// Store.set( "user", user_info );

				// current_img_url = Cookie.get( cookie_name ).value;
				// img_load.load( current_img_url, _$background, _$loading );
				img_ajax.json( cinemagraph_json, cinemaSetting );
			}
		}else {
			current_img_url = Cookie.get( cookie_name ).value;
			img_load.load( current_img_url, _$background, _$loading );
		}
	}
}

function cinemaSetting( data ){
	var ciname_url = data.cinemagraph[0].url;
	var cinema_length = data.cinemagraph[1].total;
	var random_cinema = Math.floor( Math.random() * cinema_length );

	Cookie.set( cinema_cookie_name, ciname_url + random_cinema + ".gif", "1day" );

	img_load.load( ciname_url + random_cinema + ".gif", _$background );
}

//unsplash 에서 이미지 가져오기
function getBgData(){
	$.getJSON(URL, function( data ){
		storageBgSetting( data );
	}).fail(function( data ){

	});
}

// 가져온 이미지를 로컬스토리지에 저장
function storageBgSetting( data ){
	_$.each( data, function( item, index ){
		bg_data["img" + index] = {};
		bg_data["img" + index].width = item.width;
		bg_data["img" + index].height = item.height;
		bg_data["img" + index].url = item.urls.full;
	});

	Store.set( data_name, bg_data );

	currentBgUrlSetting( bg_data );
}

// 랜덤값으로 쿠키에 이미지 url 저장하기
function currentBgUrlSetting( data ){
	var data_object = data;
	var data_all = [];
	var random_img = 0;
	var img;
	var index;

	// 저장된 이미지 정보를 배열로....
	for( var img in data_object ){
		data_all.push( img );
	}

	// 저장된 이미지 정보가 없으면 다시 정보 가져오기
	if( data_all.length === 0 ){
		return getBgData();
	}

	//저장된 이미지를 랜덤으로 하나 추출하기 위한 랜덤값 생성
	random_img = Math.floor(Math.random() * data_all.length );

	index = data_all[random_img].split("img")[1];
	img = data_object["img" + index];
	
	//랜덤하게 가져온 이미지가 width 보다 height 이 더 크면 그 이미지 지우고 재귀 호출
	if( img.width < img.height ){
		delete data_object["img" + index];
		Store.del( data_name );
		Store.set( data_name, data_object );

		return currentBgUrlSetting( data_object );
	}

	//랜덤하게 가져온 이미지 주소를 쿠키에 저장
	Cookie.set( cookie_name, img.url, "1day");

	// 랜덤하게 가져온 이미지를 다음번에 다시 가져오지 않게 위해서
	// 해당 이미지 정보를 지우고 다시 로컬스토리지에 저장
	delete data_object["img" + index];
	Store.del( data_name );
	Store.set( data_name, data_object );

	current_img_url = Cookie.get( cookie_name ).value;

	img_load.load( current_img_url, _$background, _$loading );
}
},{"./ajax/ajax":9,"./cookie/cookie":11,"./image_load/images_load":15,"./storage/storage":17}],11:[function(require,module,exports){
"use strict";

module.exports = {
	"set" : function( name, value, expire_day ){
		var cookie;
		var today_date = new Date();
		var expires = "expires=";
		var path = "path=/";
		var regex = /[^0-9]/g;
		var expire_type = expire_day.split( expire_day.replace(regex, '') )[1];
		expire_day = parseInt(expire_day.replace( regex, ""), 10);

		switch( expire_type ){
			case "day" : 
				today_date.setHours(0);
				today_date.setMinutes(0);
				today_date.setSeconds(0);
				today_date.setDate( today_date.getDate() + expire_day );
			break;
			case "hour" : 
				today_date.setHours( today_date.getHours() + expire_day );
			break;
			case "min" : 
				today_date.setMinutes( today_date.getMinutes() + expire_day );
			break;
		}

		expires += today_date.toGMTString();

		cookie = name + "=" + encodeURIComponent( value );
		cookie += "; " + expires;
		cookie += "; " + path;
		
		document.cookie = cookie;
	},
	"get" : function( name ){		
		var cookie = document.cookie;
		var get_cookie = {};
		cookie = cookie.split("; ");

		for( var t = 0; t < cookie.length; t++ ){
			var item = cookie[t].split("=");

			if( item[0] === name ){
				get_cookie.name = item[0];
				get_cookie.value = decodeURIComponent(item[1]);
				return get_cookie;
			}
		}
	}
}
},{}],12:[function(require,module,exports){
"use strict";
var Cookie = require("./cookie");

var app_cookie_name = "Homentum";
var cookie_age = "10day";
var cookie_value = 0;

if( !Cookie.get(app_cookie_name) ){
	Cookie.set( app_cookie_name, cookie_value, cookie_age );
}
},{"./cookie":11}],13:[function(require,module,exports){
(function (global){
"use strict";
var _this = global;

module.exports = {
	"set" : function( fn, delay ){
		_this.setTimeout( fn, delay );
	}
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],14:[function(require,module,exports){
"use strict";
module.exports = {
    "en" : function( password ) {
        return this.codeSet( password, "en" );
    },
    "de" : function unEncrypt( password  ) {
        return this.codeSet( password, "de" );
    },
    "codeSet" : function( password, type ){
        var output = "";
        var temp = [];
        var temp2 = [];
        var text_size = password.length;
        var rnd = 0;

        for( var t = 0; t < text_size; t++ ){
            if( type === "en" ){
                rnd = Math.round(Math.random() * 122) + 68;
                temp[t] = password.charCodeAt(t) + rnd;
                temp2[t] = rnd;
            }else {
                temp[t] = password.charCodeAt(t);
                temp2[t] = password.charCodeAt(t + 1);
            }
        }

        for( var i = 0; i < text_size; type === "en" ? i++ : i=i+2 ){
            if( type === "en" ){
                output += String.fromCharCode(temp[i], temp2[i]);
            }else {
                output += String.fromCharCode(temp[i] - temp2[i]);
            }
        }
        return output;
    }
}
},{}],15:[function(require,module,exports){
"use strict";

module.exports = {
	"load" : function( url, parent_node ){
		var img = new Image();
		img.src = url;

		img.onload = function( event ){
			_$.css( parent_node, "background-image", 'url('+ img.src +')' );
			parent_node.classList.add("on");
		}
	}
}
},{}],16:[function(require,module,exports){
"use strict";
var html_load = require("../ajax/ajax");
var Store = require( "../storage/storage" );
var Encryption = require("../encryption");
var Delay_fn = require("../delay_fn");
var Widget = require("../widget/widget");

var name_html_url = "module/join/name.html";
var pass_html_url = "module/join/password.html";
var user_info = {
	"name" : "",
	"password" : ""
}

var default_bookmark = [
	{
		"name" : "Google",
		"info" : {
			"icon" : "http://www.google.com/s2/favicons?domain=http://google.com",
			"url" : "http://google.com"
		}
	}
];

var default_todo = [
	// {
	// 	"title" : "Google",
	// 	"check" : true
	// }
];

var _$join;
var _$content = _$.query(".content_container");
var _$bg = _$.query(".background");
var _$loading = _$.query(".loading");

var _this = module.exports = {
	"join" : function( url ){
		// 처음 name.html 불러들이기
		if( url === undefined ){
			url = name_html_url;
		}
		//html 로드
		html_load.html( url, inputSetting);
	}
}

// bg가 로드 되어있는지 확인
function bgLoadCheck(){
	//bg가 로드 완료 되었다면
	if( _$bg.classList.contains("on") ){
		_$content.classList.add("on");
		$.data( _$loading, "$this").fadeOut("fast");
	}else {
		//완료 되지 않았다면 재귀 호출
		Delay_fn.set( bgLoadCheck, 1000 );
	}
}

//html이 로드 완료되면
function inputSetting( data ){
	var _$input;

	// html추가
	_$content.insertAdjacentHTML("beforeend", data);

	_$join = _$.query(".join_container");
	_$input = _$.query("input", _$content);

	//현재 로드한 html이 password.html 이라면
	if( _$input.classList.contains("input_password") ){
		_$content.classList.add("on");
	}else {
		//현재 로드한 html이 name.html 이라면
		bgLoadCheck();
	}

	// input에 keydown 이벤트 등록
	_$.eventsOn( _$input, "keydown", inputEventHandler );
}

function inputEventHandler( event ){
	if( event.keyCode === 13 ){
		if( event.target.value !== "" ){
			if( event.target.classList.contains("input_name") ){
				//name을 입력하였다면
				user_info.name = event.target.value;

				// name 화면이 다 사라지기 전까지 대기하였다가
				// 1.5초뒤에 name.html을 지우고
				// password.html을 호출
				Delay_fn.set(function(){
					_$content.removeChild( _$join );
					_this.join( pass_html_url );
				}, 1000 );
			}else {
				//입력한 암호문자열을 아스키로 바꿔준다
				user_info.password = Encryption.en( event.target.value );
				//기본 북마크를 저장
				user_info.book = default_bookmark;
				//비어있는
				user_info.todo = default_todo;

				user_info.cinema = false;

				//로컬스토리지에 이름과 비번 저장
				Store.set("user", user_info);
				$.data( _$loading, "$this").delay(700).fadeIn("fast", function(){
					_$content.removeChild( _$join );
					//완료되면 메인 위젯 시작
					Widget.start();
				});
			}

			//화면 없애기
			_$content.classList.remove("on");
		}
	}
}
},{"../ajax/ajax":9,"../delay_fn":13,"../encryption":14,"../storage/storage":17,"../widget/widget":26}],17:[function(require,module,exports){
(function (global){
"use strict";

module.exports = {
	"storage" : global.localStorage,
	"JSON" : global.JSON,
	"get": function( storage_name, key ){
		if( storage_name ){
			if( key ){
				var json = this.JSON.parse( this.storage.getItem(storage_name) );
				return json[key];
			}else {
				return this.JSON.parse( this.storage.getItem(storage_name) );
			}
		}else {
			return this.storage;
		}
	},
	"set": function( key, value ){
		this.storage.setItem( key, this.JSON.stringify(value) );
	},
	"del": function( key ){		
		this.storage.removeItem( key );
	},
	"clear": function(){
		this.storage.clear();
	}
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],18:[function(require,module,exports){
"user strict";
var User_join = require("../join/join");
var Store = require( "./storage" );
var user = Store.get( "user" );
var Widget = require("../widget/widget");

//등록된 유저가 없다면
if( user === null ){
	User_join.join();
}else {
	Widget.start();
}

// if( users.length === 0 ){
// 	// 회원가입
// 	// 유저 아이디
// 	// 유저 비밀번
// }else {
// 	// 유저를 뿌려서 로그인 시키자
// }
},{"../join/join":16,"../widget/widget":26,"./storage":17}],19:[function(require,module,exports){
"use strict";

module.exports = function( el ){

var Buttons = function( _el ){
	this.el = _el;

	this.init = function(){
		var parent_node = this.el.parentNode;

		parent_node.setAttribute("tabindex", "-1");

		_$.eventsOn( this.el, "click", function( event ){
			var _this = event.target;
			parent_node.classList.add("show");
		});

	};

	this.init();
};

return new Buttons(el);

};
},{}],20:[function(require,module,exports){
"use strict";
var html_load = require("../ajax/ajax");
var Store = require("../storage/storage");
var Delay_fn = require("../delay_fn");
var clock_url = "module/widget/clock.html";

var _$content = _$.query(".content_container");
var _$clock_widget;
var _$name;

var time_greetings = ["Good Morning, ", "Good Afternoon, ", "Good Evening, ", "Good Night, "];
var now_time = new Date();
var hours = now_time.getHours();
var minutes = now_time.getMinutes();


module.exports = function(){
	html_load.html( clock_url, clockSetting);
}

// 시계 위젯을 셋팅
function clockSetting( data ){
	_$content.insertAdjacentHTML("beforeend", data);

	_$clock_widget = _$.query(".clock_widget");
	_$name = _$.query(".name");

	// 초기 저장한 이름을 로컬스토리지에서 받아온다
	_$name.textContent = Store.get("user", "name");
	_$.eventsOn(_$name, "dblclick", nameSetting);
	_$.eventsOn(_$name, "blur", nameSettingBlur);
	_$.eventsOn(_$name, "keydown", nameSettingEnter);

	//시간세팅
	timeSetting( now_time );
	//현재 시간 감지 함수
	nowTime();

	_$clock_widget.classList.add("on");
}

function nameSetting( event ){
	var _this = event.target;
	_this.setAttribute("contenteditable", "true");
	_this.focus();
}

function nameSettingBlur( event ){
	var _this = event.target;
	var user_info = Store.get("user");
	_this.setAttribute("contenteditable", "false");
	user_info.name = _this.innerText;
	Store.set("user", user_info);
}

function nameSettingEnter( event ){
	var _this = event.target;
	var _$todo_name = _$.query(".todo_name");

	if( event.keyCode === 13 ){
		var user_info = Store.get("user");
		_this.setAttribute("contenteditable", "false");	
		user_info.name = _this.innerText;
		_$todo_name.textContent = " " + _this.innerText;
		Store.set("user", user_info);
	}
}

//현재 시간을 분단위로 감지하여 이전 시간( 분 )이랑 다를시 현재 시간으로 셋팅
function nowTime(){
	var now = new Date();

	//분을 전역에 저장하여 현재 시간(분) 이랑 저장한 시간이랑 다를시
	// 현재 시간으로 셋팅한다
	if( minutes !== now.getMinutes() ){
		minutes = now.getMinutes();
		timeSetting( now );
	}

	// 1초마다 현재 시간을 감지
	Delay_fn.set( nowTime, 1000 );
}

//화면 시간 셋팅
function timeSetting( _now ){
	var _$time = _$.query(".time");
	var _$period = _$.query(".period");

	var _hours = _now.getHours();
	var _minutes = _now.getMinutes();

	var time = [];
	var ampm = "AM ";
	var greetings;

	// 시간별로 인사말을 설정한다
	if( _hours >= 5 && _hours < 12 ){
		greetings = time_greetings[0];
	}else if( _hours >= 12 && _hours < 18 ){
		greetings = time_greetings[1];
	}else if( _hours >= 18 && _hours < 22 ){
		greetings = time_greetings[2];
	}else {
		greetings = time_greetings[3];
	}

	// am pm 설정
	if( _hours >= 12 ){
		_hours -= 12;
		ampm = "PM ";
	}

	time.push( ampm );
	time.push( _hours );
	time.push( ":" );
	time.push( _minutes );
	time.push( greetings );

	// 기존 설정한 내용을 지우고
	_$time.textContent = "";
	_$period.textContent = "";

	//새로 갱신한 시간으로 셋팅한다
	time.forEach(function( _time, index ){
		if( index !== 0 || index !== 2 ){
			if( _time < 10 ){
				time[index] = "0" + _time;
			}
		}

		if( index !== 4 ){
			_$time.textContent += time[index];
		}else {
			_$period.textContent += time[index];
		}
	});
}
},{"../ajax/ajax":9,"../delay_fn":13,"../storage/storage":17}],21:[function(require,module,exports){
(function (global){
"user strict";
var links_load = require("../ajax/ajax");
var Store = require("../storage/storage");
var Buttons = require("./button");
var Delay_fn = require("../delay_fn");
var _$content = _$.query(".content_container");
var _$link_list_wrap = _$.query(".link_list_wrap");

var _$add_btn;
var _$link_list;
var _$links_widget;
var _$add_link_wrap;
var _$body = _$.query("body");

var JSON = global.JSON;
var links_html_url = "module/widget/links.html";

module.exports = function(){
	links_load.html( links_html_url, linkSetting );
};

function linkSetting( data	){
	_$content.insertAdjacentHTML("beforeend", data);

	_$links_widget = _$.query(".links_widget");
	_$links_widget.classList.add("on");

	var _$links =  _$.query(".links");
	Buttons( _$links );

	_$link_list = _$.query(".link_list");

	_$add_btn = _$.query(".add");

	bookmarkSetting();
	addBtnSetting();
	searchSetting();
}

function searchSetting(){
	var _$search = _$.query("#search");
	var _$input = _$.query(".search_txt");
	var _$search_select = _$.query(".search_select");

	_$.eventsOn( _$search, "click", searchOn );
	_$.eventsOn( _$body, "focus", searchOff );
	_$.eventsOn( _$input, "keydown", keywordSearch );

	function searchOn( event ){
		var _this = event.currentTarget;
		_this.classList.add("on");
		_$search_select.classList.add("on");
		_$input.focus();
	}

	function searchOff( event ){
		_$search.classList.remove("on");
		_$search_select.classList.remove("on");
	}

	function keywordSearch( event ){
		var _this = event.target;
		var _$radio = _$.queryAll( "input", _$search_select );
		var search_type;

		if( event.keyCode === 13 ){
			if( event.target.value !== "" ){
				for( var t = 0; t < _$radio.length; t++ ){
					if( _$radio[t].checked ){
						location.href = _$radio[t].value + event.target.value;
						return;
					}
				}
			}
		}
	}
}

function bookmarkSetting(){
	var user_info = Store.get("user");

	user_info.book.forEach(function( bookmark ){
		creatBookmarkList( bookmark );
	});
}

function creatBookmarkList( _book ){
	var _$li = document.createElement("li");
	var _$a = document.createElement("a");
	var _$name = document.createTextNode( _book.name );
	_$a.setAttribute("href", _book.info.url);
	_$a.setAttribute("alt", _book.name);
	_$.css( _$a, "background-image", 'url('+ _book.info.icon +')' );
	_$a.appendChild( _$name );

	_$li.appendChild( _$a );

	if( _book.name !== "Google" ){
		var _$span = document.createElement("span");
		var x_icon = document.createTextNode("X");

		_$span.classList.add("destroy");
		_$span.appendChild( x_icon );
		_$li.appendChild( _$span );

		removeBookmark( _$span );
	}

	_$link_list.appendChild( _$li );
}

function removeBookmark( _btn ){
	var delete_book;
	var user_info = Store.get("user");

	_$.eventsOn( _btn, "click", function( event ){
		var _this = event.target;
		delete_book = _this.previousSibling.text;

		_$.each( user_info.book, function( _book, index ){
			if( index !== 0 ){
				if( _book.name === delete_book ){
					user_info.book.splice(index,1);
				}
			}
		});
		_this.parentNode.remove();

		Store.del("user");
		Store.set("user", user_info);
	});
}

function addBtnSetting(){
	var _$title = _$.query(".title");
	var _$address = _$.query(".address");
	_$add_link_wrap = _$.query(".add_link_wrap");

	_$.eventsOn( _$add_btn, "click", addBtn);
	function addBtn( event ){
		var _this = event.target;
		_$add_link_wrap.classList.toggle("show");
	}

	_$.eventsOn( _$title, "keydown", function( event ){
		var _this = event.target;
		if( event.keyCode === 13 ){
			if( _this.value === "" ){
				inputError(_this, 300);
			}else {
				inputError(_$address, 300);
			}
		}
	});

	_$.eventsOn( _$address, "keydown", function( event ){
		var _this = event.target;

		if( event.keyCode === 13 ){
			if( _this.value === "" ){
				inputError(_this, 300);
			}else {
				if( _$title.value === "" ){
					inputError(_$title, 300);
				}else {
					bookmarkStorageSave( _$title, _$address );
				}
			}
		}
	});

	function inputError(el, time){
		el.focus();
		el.classList.add("error");
		Delay_fn.set(function(){
			el.classList.remove("error");
		}, 300);
	}
}

function bookmarkStorageSave( name, addr ){
	var user_info = Store.get("user");

	 var _url  = addr.value

	 if( _url.indexOf('http') === -1 ){
	 	_url = "http://" + _url;
	 }

	var bookmark = {
		"name" : name.value,
		"info" : {
			"icon" : "http://www.google.com/s2/favicons?domain=" + _url,
			"url" : _url
		}
	}

	user_info.book.push(bookmark);

	Store.del("user");
	Store.set("user", user_info);

	creatBookmarkList( bookmark );

	name.value = "";
	addr.value = "";
	_$add_link_wrap.classList.remove("show");
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../ajax/ajax":9,"../delay_fn":13,"../storage/storage":17,"./button":19}],22:[function(require,module,exports){
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




},{"../ajax/ajax":9,"../delay_fn":13}],23:[function(require,module,exports){
(function (global){
"use strict";
var setting_load = require("../ajax/ajax");
var Store = require("../storage/storage");
var Buttons = require("./button");
var _$content = _$.query(".content_container");
var Encryption = require("../encryption");
var img_load = require("../image_load/images_load");
var Cookie = require("../cookie/cookie.js");
var Delay_fn = require("../delay_fn");

var _$setting_widget;

var _$setting_list;

var JSON = global.JSON;

var setting_html_url = "module/widget/setting.html";
// var cinemagraph_json = "./js/cinemagraph.json";
var cinemagraph_json = "./cinemagraph/cinemagraph.json";
var _$background = _$.query(".background");
var _$loading = _$.query(".loading");
var cinema_cookie_name = "cinema";
var bg_cookie_name = "background-image";

module.exports = function(){
	setting_load.html( setting_html_url, setupSetting );
};

function setupSetting( data ){
	_$content.insertAdjacentHTML("beforeend", data);

	_$setting_widget = _$.query(".setting_widget");
	_$setting_widget.classList.add("on");

	var _$setting =  _$.query(".setting");
	_$setting_list = _$.query(".setting_list");
	Buttons( _$setting );

	if( Store.get( "user" ).cinema ){
		var _$switch = _$.query(".bg_check");
		_$switch.checked = true;
	}

	settingButton();
	passwordChangeSetting();
	userReset();
	cinemagraphSetting();
}

function settingButton(){
	var setting_btn = _$.query(".setting>span");
	var _$setting_list = _$.query(".setting_list");
	var _$password = _$.query(".setting_password");

	_$.eventsOn( setting_btn, "click", function( event ){
		var _this = event.target;
		var _$show_list = _$.query(".show", _$setting_list);

		if( _$show_list ){
			_$show_list.classList.remove("show");
		}

		_$password.classList.add("show");
	});

	setupListBtn();
}

function setupListBtn(){
	var _$btn = _$.queryAll( ".btn", _$setting_list );

	_$.each( _$btn, function( btn, index ){
		_$.eventsOn( btn, "click", setupBtnClickHandler);
	});

	function setupBtnClickHandler( event ){
		var _$show_btn = _$.query(".show", _$setting_list);

		_$show_btn.classList.remove("show");
		event.target.parentNode.classList.add("show");
	}
}

function passwordChangeSetting(){
	var _$password_container = _$.query(".password_setting");
	var _$pass_btn = _$.query( "button", _$password_container );
	var _$password_input = _$.queryAll( "input", _$password_container );

	_$.eventsOn( _$pass_btn, "click", function( event ){
		var user_info;
		var current_password;
		var input_password;
		var de_password;
		var en_password;

		for( var t = 0; t < _$password_input.length; t++ ){
			if( _$password_input[t].value === "" ){
				classAddRemove( _$password_input[t], "add" );
				break;
			}else {
				classAddRemove( _$password_input[t], "remove" );
			}

			switch( t ){
				case 0 :
					user_info = Store.get("user");
					input_password = _$password_input[t].value;
					de_password = Encryption.de( user_info.password );

					if( input_password !== de_password ){
						classAddRemove( _$password_input[t], "add" );
						return false;
					}
				break;
				case 1 :
					current_password = _$password_input[t].value;
				break;
				case 2 :
					if( current_password !== _$password_input[t].value ){
						classAddRemove( _$password_input[1], "add" );
						return false;
					}else {
						en_password = Encryption.en( _$password_input[t].value );
						user_info.password = en_password;
						Store.del("user");
						Store.set( "user", user_info );
						_$.each( _$password_input, function( input, index ){
							input.value = "";
						});
						alert("Password Change Success");
					}
				break;
			}
		}
	});
}

function userReset(){
	var _$reset_container = _$.query(".reset_setting");
	var _$reset_btn = _$.query( "button", _$reset_container );
	var _$reset_input = _$.query( "input", _$reset_container );

	var user_info;
	var de_password;
	var input_password;

	_$.eventsOn( _$reset_btn, "click", function( event ){
		if( _$reset_input.value === "" ){
			classAddRemove( _$reset_input, "add" );
		}else {
			user_info = Store.get("user");
			input_password = _$reset_input.value;
			de_password = Encryption.de( user_info.password );

			if( input_password !== de_password ){
				classAddRemove( _$reset_input, "add" );
			}else {
				Store.del("user");
				alert("Reset User");
				global.location.reload(true);
			}
		}
	});
}

function classAddRemove( target, type ){
	target.parentNode.classList[type]("error");
}

function cinemagraphSetting(){
	var _$switch = _$.query(".bg_check");

	_$.eventsOn( _$switch, "click", function( event ){
		var _$this = event.target;
		var user_info = Store.get("user");
		
		_$background.classList.remove("on");
		$.data( _$loading, "$this").fadeIn("fast");
		bgLoadCheck();

		if( _$this.checked ){
			if( !Cookie.get( cinema_cookie_name ) ){
				setting_load.json( cinemagraph_json, cinemaSetting );
			}else {
				img_load.load( Cookie.get( cinema_cookie_name ).value, _$background );
			}

			user_info.cinema = true;
		}else {
			img_load.load( Cookie.get( bg_cookie_name ).value, _$background );
			user_info.cinema = false;
		}

		Store.del("user");
		Store.set( "user", user_info );
	});
}

function bgLoadCheck(){
	if( _$background.classList.contains("on") ){
		$.data( _$loading, "$this").fadeOut("fast");
	}else {
		Delay_fn.set( bgLoadCheck, 1000 );
	}
}

function cinemaSetting( data ){
	var ciname_url = data.cinemagraph[0].url;
	var cinema_length = data.cinemagraph[1].total;
	var random_cinema = Math.floor( Math.random() * cinema_length );

	Cookie.set( cinema_cookie_name, ciname_url + random_cinema + ".gif", "1day" );

	img_load.load( ciname_url + random_cinema + ".gif", _$background );
}























}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../ajax/ajax":9,"../cookie/cookie.js":11,"../delay_fn":13,"../encryption":14,"../image_load/images_load":15,"../storage/storage":17,"./button":19}],24:[function(require,module,exports){
(function (global){
"use strict";
var todo_load = require("../ajax/ajax");
var Store = require("../storage/storage");
var Buttons = require("./button");
var Delay_fn = require("../delay_fn");
var _$content = _$.query(".content_container");

var _$todo_widget;
var _$todo_list;
var _$todo_list_wrap;

var JSON = global.JSON;

var todo_html_url = "module/widget/todo.html";

module.exports = function(){
	todo_load.html( todo_html_url, todoListSetting );
};

var todoStorageSet = {
	"set" : function( todo_obj ){
		var user_info = Store.get("user");
		user_info.todo.push( todo_obj );
		Store.del("user");
		Store.set("user", user_info);
	}
}

function todoListSetting( data ){
	var user_name = Store.get("user").name;
	_$content.insertAdjacentHTML("beforeend", data);

	_$todo_widget = _$.query(".todo_widget");
	_$todo_widget.classList.add("on");

	var _$todo =  _$.query(".todo");
	Buttons( _$todo );

	var _$todo_user_name = _$.query(".todo_name");
	_$todo_user_name.textContent = " " + user_name;

	_$todo_list = _$.query(".todo_list");
	_$todo_list_wrap = _$.query(".todo_list_wrap");

	todoInputEvent();

	todoInit();
}

function todoInit(){
	var user_info = Store.get("user");

	if( user_info.todo.length !== 0){
		user_info.todo.forEach(function( todo ){
			createTodoList( todo );
		});
	}else {
		todoCount();
	}
}

function todoInputEvent(){
	var _$todo_title = _$.query(".todo_title");

	_$.eventsOn( _$todo_title, "keydown", function( event ){
		var _this = event.target;
		var user_info = Store.get("user");
		var todo_ob = {
			"title" : "",
			"check" : false
		};

		if( event.keyCode === 13 ){
			if( _this.value !== "" ){
				todo_ob.title = _this.value;
				todoStorageSet.set( todo_ob );

				createTodoList( todo_ob );
				_this.value = "";
				_this.focus();
			}else {
				_this.classList.add("error");
				Delay_fn.set(function(){
					_this.classList.remove("error");
				}, 300);
			}
		}
	});
}

function createTodoList( todo ){
	var _$li = document.createElement("li");

	var _$label = document.createElement("label");
	var _$input = document.createElement("input");
	_$input.setAttribute("type", "checkbox");
	_$input.checked = todo.check;
	_$input.classList.add("todo_check");
	_$label.appendChild( _$input );

	var _$span1 = document.createElement("span");
	var _$span2 = document.createElement("span");
	var _todo = document.createTextNode( todo.title );
	var x_icon = document.createTextNode("x");
	_$span1.classList.add("todo_item");
	_$span1.appendChild( _todo );
	_$span2.classList.add("todo_remove");
	_$span2.appendChild( x_icon );

	_$li.appendChild( _$label );
	_$li.appendChild( _$span1 );
	_$li.appendChild( _$span2 );
	_$todo_list.appendChild( _$li );

	if( todo.check ){
		_$li.classList.add("check");
	}

	todoCount();

	inputEventSetting( _$input );
	todoRemoveBtnSetting( _$span2 );
}

function todoRemoveBtnSetting( remove_btn ){
	_$.eventsOn( remove_btn, "click", function(){
		var _this = event.target;
		var _li = _this.parentNode;
		var _todo = _$.query( ".todo_item", _li );
		var check_todo_title = _todo.innerText;

		var user_info = Store.get("user");

		for( var t = 0; t < user_info.todo.length; t++ ){
			if( check_todo_title === user_info.todo[t].title ){
				user_info.todo.splice( t, 1 );
				break;
			}
		}

		Store.del("user");
		Store.set("user", user_info);

		_li.remove();

		todoCount();
	});
}

function inputEventSetting( _input ){
	_$.eventsOn( _input, "click", function( event ){
		var _this = event.target;
		var _li = _this.parentNode.parentNode;
		var _todo = _$.query( ".todo_item", _li );
		var check_todo_title = _todo.innerText;

		if( _this.checked ){
			_li.classList.add("check");
		}else{
			_li.classList.remove("check");
		}

		var user_info = Store.get("user");

		for( var t = 0; t < user_info.todo.length; t++ ){
			if( check_todo_title === user_info.todo[t].title ){
				user_info.todo[t].check = _this.checked;
				break;
			}
		}

		Store.del("user");
		Store.set("user", user_info);

		todoCount();
	});
}

function todoCount(){
	var _$todo_count = _$.query( ".count", ".todo_count" );
	var todo_list = _$.queryAll( "li", _$todo_list )
	var todo_count = 0;

	_$.each( todo_list, function( item, index ){
		if( !item.classList.contains("check") ){
			todo_count = todo_count + 1; 
		}
	});

	if( todo_count === 0 ){
		_$todo_list_wrap.classList.add("empty");
		
	}else {
		_$todo_list_wrap.classList.remove("empty");
	}

	_$todo_count.innerText = todo_count + " ";
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../ajax/ajax":9,"../delay_fn":13,"../storage/storage":17,"./button":19}],25:[function(require,module,exports){
(function (global){
"use strict";
var weather_load = require("../ajax/ajax");
var Store = require("../storage/storage");
var Cookie = require("../cookie/cookie");
var _$content = _$.query(".content_container");
var _$weather_widget;

var JSON = global.JSON;

var weather_html_url = "module/widget/weather.html";
var weather_cookie_name = "weather";

var APIKEY = "444e1d60a1b68a671aeca7ece0111503";
var id_url = "APPID=" + APIKEY;
var weather_url = "http://api.openweathermap.org/data/2.5/weather?";

var weather_info = {};

module.exports = function(){
	// 날씨 쿠키값이 있다면
	if( !Cookie.get( weather_cookie_name ) ){
		// 없으면 현재 위치값을 통해 날씨값을 받아온다
		myGeolocation();
	}else {
		//쿠키값이 있으면 쿠키에 저장된 날씨값으로 셋팅한다
		weather_load.html( weather_html_url, weatherSetting );
	}
}

// api에서 날씨 정보를 받아온다
var weather = {
	"get_weather" : function( url ){
		weather_load.json( url, weatherInforSetting);
	}
}

// 현재 위치값을 navigator.geolocation(gps)값으로 받아온다 
function myGeolocation(){
	var gps = global.navigator.geolocation;

	gps.getCurrentPosition(
		browserGeolocationSuccess,
		browserGeolocationFail
	);
}

function browserGeolocationSuccess( position ){
	var gps_value = gpsValueSetting(position.coords.latitude, position.coords.longitude);
	apiURLSetting( gps_value );
};

function browserGeolocationFail( error ) {
	switch(error.code) {
		case error.TIMEOUT:
			console.error("Browser geolocation error !\n\nTimeout.");
		break;
		case error.PERMISSION_DENIED:
			if(error.message.indexOf("Only secure origins are allowed") == 0) {
				tryAPIGeolocation();
			}
		break;
		case error.POSITION_UNAVAILABLE:
			console.error("Browser geolocation error !\n\nPosition unavailable.");
		break;
	}
};

function tryAPIGeolocation(){
	$.post( 
	"https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCxmgm9qbKiofIPyPTeDkl1AmGTIWhxFeA",
	function(success){
		apiGeolocationSuccess({coords: {latitude: success.location.lat, longitude: success.location.lng}});
	}).fail(function(err) {
		console.error("API Geolocation error! \n\n"+err);
	});
};

function apiGeolocationSuccess(position) {
	var gps_value = gpsValueSetting(position.coords.latitude, position.coords.longitude);
	apiURLSetting( gps_value );
};

function gpsValueSetting( lat, long ){
	return "lat=" + lat + "&" + "lon=" + long + "&";
}

// ajax 통신을 위해 호출할 api 주소를 셋팅한다.
function apiURLSetting( gps_value ){
	var url = "";
	var url_array = [];
	var base = weather_url;
	var id = id_url;
	url_array.push( base );
	url_array.push( gps_value );
	url_array.push( id );

	url_array.forEach(function( _url, index ){
		url += _url;
	});

	// 만들어진 주소로 api 호출
	weather.get_weather( url );
}

// 받아온 날씨 정보를 객체로 셋팅
function weatherInforSetting( data ){
	//받아온 온도를 섭시로 변경
	var temp = Math.floor( data.main.temp - 273 );
	var city = data.name;
	var weather_main = data.weather[0];
	var weather_json;

	weather_info.city = city;
	weather_info.temp = temp;
	weather_info.icon = weather_main.icon

	// 풍향 풍속 세팅
	windSetting( data.wind.speed, data.wind.deg );

	// 셋팅한 날씨정보 객체를 JSON으로 만든다
	weather_json = JSON.stringify( weather_info );
	//JSON정보를 쿠키에 저장 주기는 1시간으로
	Cookie.set( weather_cookie_name, weather_json, "1hour" );

	//날씨 위젯을 받아온다
	weather_load.html( weather_html_url, weatherSetting );
}

// 받아온 날씨정보로 날씨 위젯을 만든다
function weatherSetting( data ){
	var get_info = JSON.parse( Cookie.get( weather_cookie_name ).value );

	_$content.insertAdjacentHTML("beforeend", data);

	var _$icon = _$.query("#weatherIcon");
	var _$temp = _$.query(".temp");
	var _$wind_position = _$.query(".wind_position")
	var _$wind_speed = _$.query(".wind_speed");
	var _$city = _$.query(".city");

	_$temp.textContent = get_info.temp;
	_$wind_position.textContent = get_info.wind_position;
	_$wind_speed.textContent = get_info.wind_speed + " m/s";
	_$city.textContent = get_info.city;

	//날씨 아이콘 세팅
	iconSetting( _$icon, get_info.icon, get_info.wind_speed );

	_$weather_widget = _$.query(".weather_widget");

	_$weather_widget.classList.add("on");
}

//날씨 아이콘 셋팅
function iconSetting( _$icon, weather_type, _wind_speed ){
	//http://openweathermap.org/weather-conditions  참조
	// 위주소를 참조하여 날씨 아이콘을 생성

	switch( weather_type ){
		case "01d": weather_type = "CLEAR_DAY"; break;
		case "01n": weather_type = "CLEAR_NIGHT"; break;
		case "02d": weather_type = "PARTLY_CLOUDY_DAY"; break;
		case "02n": weather_type = "PARTLY_CLOUDY_NIGHT"; break;
		case "03d":case "03n":case "04d":case "04n": weather_type = "CLOUDY"; break;
		case "09d":case "09n":case "11d":case "11n": weather_type = "SLEET"; break;
		case "10d":case "10n": weather_type = "RAIN"; break;
		case "13d":case "13n": weather_type = "SNOW"; break;
		case "50d":case "50n": weather_type = "FOG"; break;
	}

	//바람이 쌔면 바람 아이콘을 불러온다
	switch( weather_type ){
		case "CLEAR_DAY" : 
		case "CLEAR_NIGHT" : 
		case "PARTLY_CLOUDY_DAY" : 
		case "PARTLY_CLOUDY_NIGHT" : 
		case "CLOUDY" : 
		case "FOG" : 
			if( _wind_speed >= 8 ){
				weather_type = "WIND";
			}
		break;
	}

	var skycons = new Skycons( {"color" : "#fff"} );
	skycons.add( _$icon , Skycons[weather_type]);

	skycons.play();
}

//풍향 풍속을 셋팅하는 함수
function windSetting( speed, deg ){
	var wind_position;

	if( deg >= 348.75 && deg < 11.25 ){
		wind_position = "N";
	}else if( deg >= 11.25 && deg < 33.75 ){
		wind_position = "NNE";
	}else if( deg >= 33.75 && deg < 56.25 ){
		wind_position = "NE";
	}else if( deg >= 56.25 && deg < 78.75 ){
		wind_position = "ENE";
	}else if( deg >= 78.75 && deg < 101.25 ){
		wind_position = "E";
	}else if( deg >= 101.25 && deg < 123.75 ){
		wind_position = "ESE";
	}else if( deg >= 123.75 && deg < 146.25 ){
		wind_position = "SE";
	}else if( deg >= 146.25 && deg < 168.75 ){
		wind_position = "SSE";
	}else if( deg >= 168.75 && deg < 191.25 ){
		wind_position = "S";
	}else if( deg >= 191.25 && deg < 213.75 ){
		wind_position = "SSW";
	}else if( deg >= 213.75 && deg < 236.25 ){
		wind_position = "SW";
	}else if( deg >= 236.25 && deg < 258.75 ){
		wind_position = "WSW";
	}else if( deg >= 258.75 && deg < 281.25 ){
		wind_position = "W";
	}else if( deg >= 281.25 && deg < 303.75 ){
		wind_position = "WNW";
	}else if( deg >= 303.75 && deg < 326.25 ){
		wind_position = "NW";
	}else if( deg >= 326.25 && deg < 348.75 ){
		wind_position = "NNW";
	}

	weather_info.wind_speed = speed;
	weather_info.wind_position = wind_position;
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../ajax/ajax":9,"../cookie/cookie":11,"../storage/storage":17}],26:[function(require,module,exports){
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

var widget = [];
widget.push( Clock );
widget.push( Weather );
widget.push( Link );
widget.push( Todo );
widget.push( News );
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
	var _$news_list = _$.query(".news_list");

	if( show_container.length !== 0 ){
		_$.each(show_container, function(_wid, index){
			_wid.classList.remove("show");
		});
	}

	if( _$news_list.classList.contains("on") ){
		_$news_list.classList.remove("on");
	}
});

}
},{"../delay_fn":13,"./clock":20,"./links":21,"./news":22,"./setting":23,"./todo":24,"./weather":25}]},{},[1]);

//# sourceMappingURL=app.bundle.js.map
