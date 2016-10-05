var util = require("gulp-util");
var type = require("./type");

function _log( message ){
	color = "blue";
	util.log(util.colors[color]('───────────────────────────────'));
	util.log(' ' + util.colors[color](message));
	util.log(util.colors[color]('───────────────────────────────'));
}

function log( data_message ){
	if( !data_message ){
		return console.error("전달 인자가 없습니다.");
	}

	if( type( data_message ) === "string" ){
		_log( data_message );
	}

	if( type( data_message ) === "object" ){
		for( var key in data_message ){
			if( data_message.hasOwnProperty(key) ){
				_log( data_message[key] );
			}
		}
	}
}

module.exports = log;