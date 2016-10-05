"use strict";
var name = $namespace( "_$" );

function each( _data, _callback ) {
	if ( !_data.length || name.isString( _data ) ) {
		console.error('배열 또는 유사배열 데이터 유형만 처리가 가능합니다.');
	}

	if ( !name.isFunction( _callback ) ) {
		console.error('함수 데이터 유형만 처리가 가능합니다.');
	}

	if ( Array.isArray( _data ) ) {
		_data.forEach( _callback );
	} else {
		[].forEach.call( _data, _callback );
	}
}
name.each = each;