var Lazy = require("lazy.js");
var commonSettings = require("./settings.common.js");


module.exports = Lazy(commonSettings).merge({
	HOST: "localhost",
	PORT: process.env.PORT || 5000,
	CUSTOM_SETTINGS: {
		API_BASE_URL: (process.env.URL) + "/api/",
		CORS: true
	}
}).toObject();
