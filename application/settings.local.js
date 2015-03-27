var commonSettings = require("./settings.common.js");

module.exports = Object.assign({}, commonSettings, {
	"HOST": "127.0.0.1",
	"PORT": "8080",
	"ENABLE_HOT_MODULE_REPLACEMENT": true,
	"WEBPACK_PORT": "8081"
});
