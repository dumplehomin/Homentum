"use strict";

var name = $namespace( "_$" );

function checkElement( element_node ){
	if( !element_node || element_node.nodeType !== 1 ){
		throw new Error("전달된 첫번째 인자가 요소노드가 아닙니다");
	}
}

var addEvent = (function(){
	var _addEvent;

	if( global.addEventListener ){
		_addEvent = function( element_node, event_type, callback, capture ){
			checkElement( element_node );
			capture = capture || false;
			element_node.addEventListener( event_type, callback, capture );
		}
	}else if( global.attachEvent ){
		_addEvent = function( element_node, event_type, callback, capture ){
			checkElement( element_node );
			capture = capture || false;
			element_node.attachEvent( "on" + event_type, callback );
		}
	}else {
		_addEvent = function( element_node, event_type, callback, capture ){
			checkElement( element_node );
			capture = capture || false;
			element_node["on" + event_type] = callback;
		}
	}

	return _addEvent;
})();


var removeEvent = (function(){
	var _removeEvent;

	if( global.addEventListener ){
		_removeEvent = function( element_node, event_type, callback, capture ){
			checkElement( element_node );
			capture = capture || false;
			element_node.removeEventListener(event_type, callback, capture);
		}
	}else if( global.attachEvent ){
		_removeEvent = function( element_node, event_type, callback, capture ){
			checkElement( element_node );
			capture = capture || false;
			element_node.detachEvent( 'on'+event_type, callback );
		}
	}else {
		_removeEvent = function( element_node, event_type, callback, capture ){
			checkElement( element_node );
			capture = capture || false;
			element_node[ "on" + event_type ] = null;
		}
	}
	return _removeEvent;
})();

name.eventsOn = addEvent;
name.eventsOff = removeEvent;