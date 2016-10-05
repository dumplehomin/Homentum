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

	if( event.keyCode === 13 ){
		var user_info = Store.get("user");
		_this.setAttribute("contenteditable", "false");	
		user_info.name = _this.innerText;
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