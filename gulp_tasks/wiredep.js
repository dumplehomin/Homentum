"use strict";

var gulp = require("gulp");
var config = require("../gulp.config");
var wiredep = require("wiredep").stream;
var log = require("./util/log");

gulp.task("wiredep", function(){
	log("bower 인젝션");
	return gulp
	.src( config.wiredep.index )
	.pipe( wiredep(config.wiredep.options) )
	.pipe( gulp.dest(config.wiredep.output) );
});