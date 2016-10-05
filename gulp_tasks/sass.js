"use strict";

var gulp = require("gulp");
var config = require("../gulp.config");
var log = require("./util/log");
var clear = require("./util/clear");
var $ = require('gulp-load-plugins')({'lazy': true});
var browser_sync = require("browser-sync");

gulp.task("sass", function(){
	log("SASS => CSS 변환 시작");
	return gulp
	.src( config.sass.src )
	// 소스맵 초기화
	.pipe( $.sourcemaps.init({ "readMaps" : true }) )
	// Sass 컴파일
	.pipe( $.sass(config.sass.options).on("error", $.sass.logError) )
	// 벤더 프리픽스 자동으로 처리
	.pipe( $.autoprefixer( config.sass.autoprefixer ) )
	.pipe( $.sourcemaps.write( config.sass.sourcemaps ) )
	// 스트림 데이터 파일을 목적지에 실제 파일로 쓰기
   .pipe( gulp.dest( config.sass.output ) );
});

gulp.task("sass:lint", ["sass"], function(){
	log("SASS 문법검사");
	return gulp
	.src( config.sass.src )
	.pipe( $.sassLint() )
	.pipe( $.sassLint.format() )
	.pipe( $.sassLint.failOnError() );
});

gulp.task( "sass:watch", ["sass"], function(){
	log("SASS 관찰");
	gulp
	.watch( config.sass.src, ["sass"] )
	.on( "change", browser_sync.reload );
});