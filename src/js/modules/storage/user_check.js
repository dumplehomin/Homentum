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