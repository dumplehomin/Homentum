var name = $namespace( "_$" );

function type( _data ) {
	// Object.prototype.toString 메소드 빌려쓰기
	return Object.prototype.toString.call( _data ).toLowerCase().slice(8,-1);
}
// type 함수를 재사용하여 결과 값을 true | false로 설정
function isNumber( _data ) {
	return type( _data) === 'number';
}

function isString( _data ) {
	return type( _data ) === 'string';
}

function isBoolean( _data ) {
	return type( _data ) === 'boolean';
}

function isFunction( _data ) {
	return type( _data ) === 'function';
}

function isArray( _data ) {
	return type( _data ) === 'array';
}

function isObject( _data ) {
	return type( _data ) === 'object';
}

function isElement( _data ) {
	return  _data  && ( _data.nodeType === 1 );
}

// dom 네임스페이스 객체의 멤버로 exports
name.type       = type;
name.isNumber   = isNumber;
name.isString   = isString;
name.isBoolean  = isBoolean;
name.isFunction = isFunction;
name.isArray    = isArray;
name.isObject   = isObject;
name.isElement  = isElement;