"use strict";

var gulp = require("gulp");
var shell = require("gulp-shell");

gulp.task("clear", shell.task(
	['rm -rf dist/css/* dist/js/* dist/**/*.html']
));

gulp.task("clear:jade", shell.task(
	['rm -rf dist/module/* dist/index.html']
));