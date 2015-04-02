var Lazy = require("lazy.js");
var commonSettings = require("./settings.common.js");


module.exports = Lazy(commonSettings).merge({
	HOST: "127.0.0.1",
	PORT: "8080",
	ENABLE_HOT_MODULE_REPLACEMENT: true,
	WEBPACK_PORT: "8081",
	CUSTOM_SETTINGS: {
		API_BASE_URL: "http://127.0.0.1:8080/api/"
	}
}).toObject();
