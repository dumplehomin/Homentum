"use strict";
var name = $namespace( "_$" );

var getStyle = (function(){
	var _getStyle;

	if( global.getComputedStyle ){
		_getStyle = function( _elNode, _property ){
			return getComputedStyle( _elNode, null )[ _property ];
		}
	}else {
		_getStyle = function( _elNode, _property ){
			return _elNode.currentStyle[ _property ];
		}
	}

	return _getStyle;
})();

function setStyle( _elNode, _property, _value){
	_elNode.style[ _property ] = _value;
}

function css( _elNode, _property, _value) {
	_property = name.toCamel( _property );

	if ( name.isElement( _elNode ) ) {
		if ( _value ) {
			setStyle( _elNode, _property, _value );
		}else {
			return getStyle( _elNode, _property);
		}
	}
}

name.css = css;