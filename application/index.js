var Ambidex = require("ambidex");
var fs = require("fs");
var settings = require("./settings.local.js");
var server = require("./server.js");

module.exports = new Ambidex({
	"settings": settings,
	"middlewareInjector": function (stack) {
		stack.map('/api', server);
	}
});
