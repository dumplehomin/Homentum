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