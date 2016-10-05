"use strict";
require("./helper/$namespace");
require("./helper/utils/_$.type");
require("./helper/utils/_$.each");
require("./helper/utils/_$.query");
require("./helper/utils/_$.css");
require("./helper/utils/_$.string");
require("./helper/utils/_$.event");
//----------------------------------------------------
var _$loading = _$.query(".loading");
$.data( _$loading, "$this", $(".loading") );
//----------------------------------------------------
require("./modules/cookie/cookie_check");
require("./modules/background.js");
require("./modules/storage/user_check.js");