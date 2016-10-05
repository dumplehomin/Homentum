"use strict";

var gulp = require("gulp");
var config = require("../gulp.config");
var inject = require("gulp-inject");
var log = require("./util/log");

gulp.task("inject", function(){
	log("HTML 인젝션");
	return gulp
	.src(config.inject.index)
    .pipe(inject(gulp.src(config.inject.css, {'read': false}), {'relative': config.inject.relative}))
    .pipe(inject(gulp.src(config.inject.js, {'read': false}), {'relative': config.inject.relative}))
    .pipe(gulp.dest(config.inject.output));
});