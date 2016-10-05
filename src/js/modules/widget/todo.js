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
	_$content.insertAdjacentHTML("beforeend", data);

	_$todo_widget = _$.query(".todo_widget");
	_$todo_widget.classList.add("on");

	var _$todo =  _$.query(".todo");
	Buttons( _$todo );

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