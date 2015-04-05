var Ambidex = require("ambidex");
var mach = require("mach");

var env = process.env.NODE_ENV || "local";
var settings = require("./settings." + env + ".js");
var server = require("./server.js");


module.exports = new Ambidex({
	settings: settings,
	middlewareInjector: function (stack) {
		stack.get("/wakemydyno.txt", function () {
			return '';
		});
		stack.map(settings.CUSTOM_SETTINGS.STATIC_URL, mach.file(__dirname + "/static"));
		stack.map("/api", server);
	}
});
