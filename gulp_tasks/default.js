"use strict";

var gulp = require("gulp");
var gulp_sync = require("gulp-sync")(gulp);

gulp.task("default", gulp_sync.sync([
	"clear",
	"browserify",
	"sass",
	"jade",
	"watch",
	"wiredep", 
	"inject",
	"server:dev"
	// ["wiredep", "inject", "html:include"],
]));