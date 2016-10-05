"use strict";

var gulp = require("gulp");
var browser_sync = require("browser-sync").create();
var config = require("../gulp.config");

gulp.task("server:dev", function(){
	browser_sync.init( config.browser_sync.options )
});