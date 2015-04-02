var Ambidex = require("ambidex");
var fs = require("fs");
var env = process.env.NODE_ENV || "local";
var settings = require("./settings." + env + ".js");
var server = require("./server.js");

module.exports = new Ambidex({
	"settings": settings,
	"middlewareInjector": function (stack) {
		stack.map('/api', server);
	}
});
