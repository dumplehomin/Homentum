var gulp = require('gulp');
var jade = require('jade');
var gulp_jade = require('gulp-jade');
var gulp_watch_jade = require('gulp-watch-jade');
var config = require('../gulp.config');
var log = require("./util/log");
var gulp_sync = require("gulp-sync")(gulp);
 
gulp.task('jade', function () {
  log("JADE 변환");
  gulp.src( config.jade.src )
    .pipe( gulp_jade({
      jade: jade,
      pretty: config.jade.pretty
    }) )
    .pipe( gulp.dest( config.jade.output ) );
});

gulp.task("jade:watch", function(){
	log("JADE 관찰");
  gulp.watch( config.jade.src, ["jade:compile"]);
});

gulp.task("jade:compile", gulp_sync.sync(
  ["clear:jade", "jade", "watch", "wiredep", "inject"]
));