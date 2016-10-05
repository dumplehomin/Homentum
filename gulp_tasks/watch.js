"use strict";

var gulp = require("gulp");

gulp.task("watch", ["browserify:watch", "jade:watch", "sass:watch"]);
