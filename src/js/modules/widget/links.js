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