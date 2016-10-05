"use strict";

module.exports = {
	"storage" : global.localStorage,
	"JSON" : global.JSON,
	"get": function( storage_name, key ){
		if( storage_name ){
			if( key ){
				var json = this.JSON.parse( this.storage.getItem(storage_name) );
				return json[key];
			}else {
				return this.JSON.parse( this.storage.getItem(storage_name) );
			}
		}else {
			return this.storage;
		}
	},
	"set": function( key, value ){
		this.storage.setItem( key, this.JSON.stringify(value) );
	},
	"del": function( key ){		
		this.storage.removeItem( key );
	},
	"clear": function(){
		this.storage.clear();
	}
}
