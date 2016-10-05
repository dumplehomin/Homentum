"use strict";
var name = $namespace( "_$" );

// CSS 문자열을 Javascript에서 처리할 수 있도록 변경
function toCamel( _str ) {
	if ( !name.isString( _str ) ) {
		throw new Error('전달된 인자 값이 문자가 아닙니다.');
	}

	return _str.replace(/-[a-z]/g, function( _$1 ) {
		return _$1.toUpperCase().replace(/-/, '');
	});
}

function toDash( _str ) {
	if ( !name.isString( _str ) ) {
		throw new Error('전달된 인자 값이 문자가 아닙니다.');
	}
	return _str.replace(/[A-Z]|_/g, function( _$1 ) {
		return '-'+_$1.toLowerCase().replace(/_/,'');
	});
}

function toUnderscore( _str ) {
	if ( !name.isString( _str ) ) {
		throw new Error('전달된 인자 값이 문자가 아닙니다.');
	}
	return _str.replace(/[A-Z]|-/g, function( _$1 ) {
		return '_'+_$1.toLowerCase().replace(/-/,'');
	});
}

function trimLeft( _str ) {
	if ( !name.isString( _str ) ) {
		throw new Error('전달된 인자 값이 문자가 아닙니다.');
	}
	return _str.replace(/^\s+/, '');
}

function trimRight( _str ) {
	if ( !name.isString( _str ) ) {
		throw new Error('전달된 인자 값이 문자가 아닙니다.');
	}
	return _str.replace(/\s+$/, '');
}

function trim( _str ) {
	if ( !name.isString( _str ) ) {
		throw new Error('전달된 인자 값이 문자가 아닙니다.');
	}
	return _str.replace(/\s+|\s+$/g, '');
}

// dom 라이브러리로 exports
name.toCamel      = toCamel;
name.toDash       = toDash;
name.toUnderscore = toUnderscore;
name.trim         = trim;
name.trimLeft     = trimLeft;
name.trimRight    = trimRight;