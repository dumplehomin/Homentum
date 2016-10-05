"use strict";
module.exports = {
    "en" : function( password ) {
        return this.codeSet( password, "en" );
    },
    "de" : function unEncrypt( password  ) {
        return this.codeSet( password, "de" );
    },
    "codeSet" : function( password, type ){
        var output = "";
        var temp = [];
        var temp2 = [];
        var text_size = password.length;
        var rnd = 0;

        for( var t = 0; t < text_size; t++ ){
            if( type === "en" ){
                rnd = Math.round(Math.random() * 122) + 68;
                temp[t] = password.charCodeAt(t) + rnd;
                temp2[t] = rnd;
            }else {
                temp[t] = password.charCodeAt(t);
                temp2[t] = password.charCodeAt(t + 1);
            }
        }

        for( var i = 0; i < text_size; type === "en" ? i++ : i=i+2 ){
            if( type === "en" ){
                output += String.fromCharCode(temp[i], temp2[i]);
            }else {
                output += String.fromCharCode(temp[i] - temp2[i]);
            }
        }
        return output;
    }
}