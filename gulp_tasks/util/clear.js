"use strict";
var del = require("del");
var log = require("./log.js");

module.exports = function(path, done){
	log("클리어 : " + path);
	del( path, done );
}