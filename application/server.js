var mach = require("mach");
var when = require("when");
var whenNode = require("when/node");
var fs = require("fs");

var env = process.env.NODE_ENV || "local";
var settings = require("./settings." + env + ".js");
var generateXML = require("./generateXML.js");

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


function BadRequestError(message, code) {
	this.name = "BadRequestError";
	this.message = message;
	this.code = code || 404;
}
BadRequestError.prototype = Object.create(Error.prototype);
BadRequestError.prototype.constructor = BadRequestError;


function get(path, handler) {
	return app.get(path, function (conn) {
		return handler(conn).catch(BadRequestError, function (error) {
			conn.text(error.code, error.message);
		});
	});
}


function post(path, handler) {
	return app.post(path, function (conn) {
		return handler(conn).catch(BadRequestError, function (error) {
			conn.text(error.code, error.message);
		});
	});
}


function jsonFile(type) {
	return __dirname + "/../data/" + type + ".json";
}


function readJson(type, name) {
	var file = jsonFile(type);
	var json = readFile(file).then(JSON.parse);
	return name ? json.then(function (data) {
		if (data[name] === undefined) {
			throw new BadRequestError("Component not found");
		}
		else {
			return data[name];
		}
	}) : json;
}


function writeJson(conn, type) {
	var file = jsonFile(type);
	var paramTypes = {};
	paramTypes[type] = String;

	return conn.getParams(paramTypes).then(function (params) {
		try {
			return JSON.parse(params[type]);
		} catch (error) {
			throw new BadRequestError(error.message);
		}
	}).then(function (data) {
		return writeFile(file, JSON.stringify(data, null, "\t") + "\n");
	}).then(function () {
		return conn.file({ path: file });
	});
}


function readXml(type, name) {
	return readJson(type, name).then(function (data) {
		var params = {};
		if (name) {
			params[type] = {};
			params[type][name] = data;
		}
		else {
			params[type] = data;
		}
		return generateXML(params);
	});
}


["components", "data"].forEach(function (type) {
	app.get("/" + type + ".json", function (conn) {
		conn.file({ path: jsonFile(type) });
	});

	post("/" + type + ".json", function (conn) {
		return writeJson(conn, type);
	});

	get("/" + type + ".xml", function (conn) {
		return readXml(type);
	});

	get("/" + type + "/:name.xml", function (conn) {
		return readXml(type, conn.params.name);
	});
});

module.exports = app;
