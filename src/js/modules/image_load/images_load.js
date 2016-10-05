"use strict";

module.exports = {
	"load" : function( url, parent_node ){
		var img = new Image();
		img.src = url;

		img.onload = function( event ){
			_$.css( parent_node, "background-image", 'url('+ img.src +')' );
			parent_node.classList.add("on");
		}
	}
}