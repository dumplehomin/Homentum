"use strict";
var Store = require("./storage/storage");
var Cookie = require("./cookie/cookie");
var img_load = require("./image_load/images_load");

var APP_ID = "0fcc3290724a3ffc55d72c6646b6cb6c0dd38986df38f3135656f6bef1443035";
var URL = "https://api.unsplash.com/photos/?client_id=" + APP_ID;

var bg_data = {};
var data_name = "background-image";
var cookie_name = data_name;
var cinema_cookie_name = "cinema";
var current_img_url;

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
				var user_info = Store.get("user");
				user_info.cinema = false;
				Store.del("user");
				Store.set( "user", user_info );

				current_img_url = Cookie.get( cookie_name ).value;
				img_load.load( current_img_url, _$background, _$loading );	
			}
		}else {
			current_img_url = Cookie.get( cookie_name ).value;
			img_load.load( current_img_url, _$background, _$loading );
		}
	}
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