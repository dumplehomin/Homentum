"use strict";

module.exports = {
	"set" : function( name, value, expire_day ){
		var cookie;
		var today_date = new Date();
		var expires = "expires=";
		var path = "path=/";
		var regex = /[^0-9]/g;
		var expire_type = expire_day.split( expire_day.replace(regex, '') )[1];
		expire_day = parseInt(expire_day.replace( regex, ""), 10);

		switch( expire_type ){
			case "day" : 
				today_date.setHours(0);
				today_date.setMinutes(0);
				today_date.setSeconds(0);
				today_date.setDate( today_date.getDate() + expire_day );
			break;
			case "hour" : 
				today_date.setHours( today_date.getHours() + expire_day );
			break;
			case "min" : 
				today_date.setMinutes( today_date.getMinutes() + expire_day );
			break;
		}

		expires += today_date.toGMTString();

		cookie = name + "=" + encodeURIComponent( value );
		cookie += "; " + expires;
		cookie += "; " + path;
		
		document.cookie = cookie;
	},
	"get" : function( name ){		
		var cookie = document.cookie;
		var get_cookie = {};
		cookie = cookie.split("; ");

		for( var t = 0; t < cookie.length; t++ ){
			var item = cookie[t].split("=");

			if( item[0] === name ){
				get_cookie.name = item[0];
				get_cookie.value = decodeURIComponent(item[1]);
				return get_cookie;
			}
		}
	}
}