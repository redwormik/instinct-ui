var Lazy = require("lazy.js");
var commonSettings = require("./settings.common.js");


module.exports = Lazy(commonSettings).merge({
	HOST: "127.0.0.1",
	PORT: "8080",
	ENABLE_HOT_MODULE_REPLACEMENT: true,
	WEBPACK_PORT: "8081",
	CUSTOM_SETTINGS: {
		RUN_SERVER_WITH_CLIENT: false,
		API_PORT: 8082,
		CORS: true
	}
}).toObject();
