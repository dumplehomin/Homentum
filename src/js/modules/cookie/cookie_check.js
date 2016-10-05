"use strict";
var Cookie = require("./cookie");

var app_cookie_name = "Homentum";
var cookie_age = "10day";
var cookie_value = 0;

if( !Cookie.get(app_cookie_name) ){
	Cookie.set( app_cookie_name, cookie_value, cookie_age );
}