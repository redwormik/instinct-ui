var mach = require("mach");

var env = process.env.NODE_ENV || "local";
var settings = require("./application/settings." + env + ".js");
var server = require("./application/server");

if (settings.CUSTOM_SETTINGS.RUN_SERVER_WITH_CLIENT) {
	console.log("Run the server along the client with npm start");
}
else {
	if (settings.CUSTOM_SETTINGS.API_PATH) {
		server = mach.map(CUSTOM_SETTINGS.API_PATH, server);
	}

	mach.serve(server, settings.CUSTOM_SETTINGS.API_PORT || 5000);
}
