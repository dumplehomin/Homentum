"use strict";

module.exports = function( el ){

var Buttons = function( _el ){
	this.el = _el;

	this.init = function(){
		var parent_node = this.el.parentNode;

		parent_node.setAttribute("tabindex", "-1");

		_$.eventsOn( this.el, "click", function( event ){
			var _this = event.target;
			parent_node.classList.add("show");
		});

	};

	this.init();
};

return new Buttons(el);

};