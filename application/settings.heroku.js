var Lazy = require("lazy.js");
var commonSettings = require("./settings.common.js");


module.exports = Lazy(commonSettings).merge({
	HOST: "localhost",
	PORT: process.env.PORT || 5000,
	CUSTOM_SETTINGS: {
		RUN_SERVER_WITH_CLIENT: true,
		API_SCHEME: "https",
		API_HOST: process.env.URL,
		API_PATH: "/api",
		CORS: true
	}
}).toObject();
