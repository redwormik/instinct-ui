var Ambidex = require("ambidex");
var settings = require("./settings.local.js");

module.exports = new Ambidex({
	"settings": settings,
	"middlewareInjector": function (stack) {
	}
});
