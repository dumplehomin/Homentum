var src   = './src/';
var dist  = './dist/';
var build = './build/';
var test  = './test/';
var temp = "./src/temp/";
var html = "./src/html_module/";

var setting_browser_sync = {
	'options': {
		'server': dist,
		'port' : 8080,
		'files' : [dist + '**/*'],
		'ghostMode': {
		'clicks' : true,
		'location' : true,
		'forms' : true,
		'scroll' : true
	},
	'injectChanges' : true,
	'logFileChanges' : true,
	'logLevel' : 'debug',
	'logPrefix' : 'gulp-process',
	'notify' : false,
	'reloadDelay' : 30 // 1000
  }
};

//Browserify 설정
var setting_browserify = {
	// 진입 파일 (번들링 시작 파일)
	'options': {
		'entries': [ src + 'js/app.js'],
		// 소스맵을 번들링된 파일에 포함
		// 'debug': false,
		// 번들링 속도 향상 (다만 파일 크기가 커짐)
		// 'insertGlobals': true
	},
	// 번들링 위치 설정
	'output': dist + 'js',

	// 생성되는 번들링 파일 이름 설정
	'output_filename': 'app.bundle.js',

	// 분리된 소스맵 파일 위치 설정
	'sourcemaps': './',

	// 이미 존재하는 소스맵 파일 읽기 설정
	'read_sourcemap': true
};

var setting_sass = {
	'src': src + ['sass/**/*.s+(a|c)ss'],
	"output" : dist + "css",
	"options" : {
		"outputStyle" : "expanded",
		// 'tab', 'space'
		"indentType" : "tab",
		"indentWidth" : 3,
		// 수치 정확도 (소수점 이하 자리 수)
		"precision" : 4,
		"sourceMap" : true
	},
	// Autoprefixer 설정
  'autoprefixer': {
    'browselist': [
      // 지역 설정
      '> 5% in KR',
      // 데스크탑 환경 설정
      'ie >= 11',
      'chrome >= 45',
      'ff >= 40',
      'safari >= 7',
      'opera >= 23',
      // 모바일 환경 설정
      'android >= 4.4',
      'ios >= 8',
      'ie_mob >= 10',
      'bb >= 10'
    ]
  },
  // 소스맵 위치 설정
  'sourcemaps': "./",
   // 컴파일 된 파일 생성 위치 설정
  'del': dist + 'css'
};

 //Wiredep 설정
var bower_json = require('./bower.json');
var setting_wiredep = {
	'index': dist + '*.html',
	'output': dist,
	'options': {
		'bowerJson'  : bower_json,
		'directory'  : bower_json.directory,
		'ignorePath' : '..',
		'exclude'    : []
	}
};

 //gulp-inject 설정
var setting_inject = {
	'index': dist + '*.html',
	'output': dist,
	'css': dist + 'css/**/*.css',
	'js': dist + 'js/**/*.bundle.js',
	'relative': true
};

var setting_jade = {
	"src" : html + "**/*.jade",
	"pretty" : true,
	"output" : dist
}

module.exports = {
	'src' : src,
	'dist' : dist,
	"html" : html,
	'build' : build,
	"temp" : temp,
	'browserify' : setting_browserify,
	'sass' : setting_sass,
	'wiredep' : setting_wiredep,
	'inject' : setting_inject,
	'browser_sync' : setting_browser_sync,
	"jade" : setting_jade
};
