var Ambidex = require("ambidex");
var mach = require("mach");

var env = process.env.NODE_ENV || "local";
var settings = require("./settings." + env + ".js");


settings.CUSTOM_SETTINGS.API_BASE_URL =
	(settings.CUSTOM_SETTINGS.API_SCHEME || "http") + "://" +
	(settings.CUSTOM_SETTINGS.API_HOST || "127.0.0.1") +
	(settings.CUSTOM_SETTINGS.API_PORT ? ":" + settings.CUSTOM_SETTINGS.API_PORT : "") +
	(settings.CUSTOM_SETTINGS.API_PATH || "") + "/";

module.exports = new Ambidex({
	settings: settings,
	middlewareInjector: function (stack) {
		stack.get("/wakemydyno.txt", function () {
			return "";
		});
		stack.map(settings.CUSTOM_SETTINGS.STATIC_URL, mach.file(__dirname + "/static"));
		if (settings.CUSTOM_SETTINGS.RUN_SERVER_WITH_CLIENT) {
			var server = require("./server.js");
			stack.map(settings.CUSTOM_SETTINGS.API_PATH, server);
		}
	}
});
