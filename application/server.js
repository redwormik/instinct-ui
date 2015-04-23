var mach = require("mach");
var whenNode = require("when/node");
var Promise = require("when/lib/Promise");
var fs = require("fs");

var env = process.env.NODE_ENV || "local";
var settings = require("./settings." + env + ".js");
var xml = require("./generateXML.js");

var writeFile = whenNode.lift(fs.writeFile);
var readFile = whenNode.lift(fs.readFile);
var app = mach.stack();

if (settings.CUSTOM_SETTINGS.CORS) {
	app.use(function (app) {
		return function (conn) {
			return conn.call(app).then(function () {
				conn.response.setHeader("Access-Control-Allow-Origin", "*");
			});
		}
	});
}

app.get("/components.json", function (conn) {
	var file = __dirname + "/../data/components.json";
	return conn.file({ path: file });
});

app.get("/components.xml", function (conn) {
	var file = __dirname + "/../data/components.json";
	return readFile(file).then(JSON.parse).then(xml.generateXMLComponents);
});

app.get("/data.json", function (conn) {
	var file = __dirname + "/../data/data.json";
	return conn.file({ path: file });
});

app.get("/data/:component.xml", function (conn) {
	var file = __dirname + "/../data/data.json";
	return readFile(file).then(JSON.parse).then(function (data) {
		var component = conn.params.component;
		if (data[component]) {
			data[component].root = component;
			return xml.generateXML(data[component]);
		}
		else {
			conn.text(404, 'Component not found');
		}
	});
});

app.post("/components.json", function (conn) {
	var file = __dirname + "/../data/components.json";
	return conn.getParams({ components: String }).then(function (params) {
		var components = JSON.parse(params.components);
		return writeFile(file, JSON.stringify(components, null, "\t") + "\n");
	}).then(function () {
		return conn.file({ path: file });
	});
});

app.post("/data.json", function (conn) {
	var file = __dirname + "/../data/data.json";
	return conn.getParams({ data: String }).then(function (params) {
		var data = JSON.parse(params.data);
		return writeFile(file, JSON.stringify(data, null, "\t") + "\n");
	}).then(function () {
		return conn.file({ path: file });
	});
});

module.exports = app;
