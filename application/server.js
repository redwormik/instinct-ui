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
				conn.response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
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


function jsonFile(type) {
	return __dirname + "/../data/" + type + ".json";
}


function getFromParams(conn, type, singular) {
	var paramTypes = {};
	var key = singular && type[type.length - 1] === "s" ?
		type.substr(0, type.length - 1) :
		type;
	paramTypes[key] = String;
	return conn.getParams(paramTypes).then(function (params) {
		if (params[key] === undefined) {
			throw new BadRequestError("Missing parameter: " + key);
		}
		try {
			return JSON.parse(params[key]);
		} catch (error) {
			throw new BadRequestError(error.message);
		}
	});
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


function newJson(conn, type) {
	var file = jsonFile(type);

	return getFromParams(conn, type, true).fold(function (data, newData) {
		var name = "Component", suffix = "", i = 1;
		while (data[name + suffix] !== undefined) {
			i++;
			suffix = "" + i;
		}
		name += suffix;
		data[name] = newData;
		return writeFile(file, JSON.stringify(data, null, "\t") + "\n").then(function () {
			return name;
		});
	}, readJson(type)).then(function (name) {
		conn.redirect(303, "/" + type + "/" + name + ".json");
	});
}


function writeJson(conn, type, name) {
	var file = jsonFile(type);

	return getFromParams(conn, type, name).then(function (data) {
		return name ? readJson(type).then(function (oldData) {
			oldData[name] = data;
			return oldData;
		}) : data;
	}).then(function (data) {
		return writeFile(file, JSON.stringify(data, null, "\t") + "\n");
	});
}


function deleteJson(type, name) {
	var file = jsonFile(type);

	return readJson(type).then(function (data) {
		delete data[name];
		return writeFile(file, JSON.stringify(data, null, "\t") + "\n");
	});
}


function readXml(types, name) {
	var data = {};

	return when.all(types.map(function (type) {
		return readJson(type, name).then(function (typeData) {
			if (name) {
				data[type] = {};
				data[type][name] = typeData;
			}
			else {
				data[type] = typeData;
			}
		});
	})).then(function () {
		return generateXML(data);
	});
}


var routes = ["get", "post", "put", "delete"].reduce(function (memo, method) {
	memo[method] = function (path, handler) {
		return app[method](path, function (conn) {
			return handler(conn).catch(BadRequestError, function (error) {
				conn.text(error.code, error.message);
			});
		});
	}

	return memo;
}, {});


var types = ["components", "data"];

types.forEach(function (type) {
	// app.get - not a promise
	app.get("/" + type + ".json", function (conn) {
		conn.file({ path: jsonFile(type) });
	});

	routes.get("/" + type + "/:name.json", function(conn) {
		return readJson(type, conn.params.name).then(function (data) {
			conn.json(data);
		});
	});

	routes.post("/" + type + ".json", function (conn) {
		return newJson(conn, type);
	});

	routes.put("/" + type + ".json", function (conn) {
		return writeJson(conn, type).then(function () {
			conn.file({ path: jsonFile(type) });
		});
	});

	routes.put("/" + type + "/:name.json", function(conn) {
		return writeJson(conn, type, conn.params.name).then(function () {
			return readJson(type, name);
		}).then(function (data) {
			conn.json(data);
		});
	});

	// app.delete - not a promise
	app.delete("/" + type + ".json", function (conn) {
		conn.text(403, 'Forbidden'); // I'm afraid I can't do that.
	});

	routes.delete("/" + type + "/:name.json", function (conn) {
		return deleteJson(type, conn.params.name).then(function () {
			conn.file({ path: jsonFile(type) });
		});
	});

	routes.get("/" + type + ".xml", function (conn) {
		return readXml([type]);
	});

	routes.get("/" + type + "/:name.xml", function (conn) {
		return readXml([type], conn.params.name, conn);
	});
});

routes.get("/all.xml", function (conn) {
	return readXml(types);
});

routes.get("/:name.xml", function (conn) {
	return readXml(types, conn.params.name);
});

app.options("*", function () {
	return "";
});

module.exports = app;
