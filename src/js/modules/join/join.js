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