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

app.use(mach.logger);
app.use(mach.charset, "utf-8");

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
	this.code = code || 400;
}
BadRequestError.prototype = Object.create(Error.prototype);
BadRequestError.prototype.constructor = BadRequestError;


function jsonFile(type) {
	return __dirname + "/../data/" + type + ".json";
}


function getParamKey(type, singular) {
	return singular && type[type.length - 1] === "s" ?
		type.substr(0, type.length - 1) : type;
}


function getFromParams(conn, types, singular, required) {
	var paramTypes = {};
	types.forEach(function (type) {
		paramTypes[getParamKey(type, singular)] = String;
	});

	return conn.getParams(paramTypes).then(function (params) {
		types.forEach(function (type) {
			var key = getParamKey(type, singular);
			if (required && params[key] === undefined) {
				throw new BadRequestError("Missing parameter: " + key);
			}
			try {
				params[type] = params[key] === undefined ?
					{} : JSON.parse(params[key]);
			} catch (error) {
				throw new BadRequestError(error.message);
			}
		});
		return params;
	});
}


function getJson(type, name) {
	var file = jsonFile(type);
	var json = readFile(file).then(JSON.parse);
	return name ? json.then(function (data) {
		if (data[name] === undefined) {
			throw new BadRequestError("Component not found", 404);
		}
		else {
			var tmp = {};
			tmp[name] = data[name];
			return tmp;
		}
	}) : json;
}


function writeJson(type, data) {
	return writeFile(jsonFile(type), JSON.stringify(data, null, "\t") + "\n");
}


function postJson(conn, types) {
	return when.map(types, function (type) {
		return getJson(type);
	}).fold(function (newData, data) {
		var name = "Component", suffix = "", i = 1;
		while (types.some(function (type, idx) {
			return data[idx][name + suffix] !== undefined;
		})) {
			i++;
			suffix = "_" + i;
		}
		name += suffix;
		return when.map(types, function (type, idx) {
			data[idx][name] = newData[type];
			return writeJson(type, data[idx]);
		}).then(function () {
			return name;
		});
	}, getFromParams(conn, types, true, false));
}


function putJson(conn, type, name) {
	return getFromParams(conn, [type], !!name, true).then(function (data) {
		return name ? getJson(type).then(function (oldData) {
			oldData[name] = data[type];
			return oldData;
		}) : data[type];
	}).then(function (data) {
		return writeJson(type, data);
	});
}


function deleteJson(types, name) {
	return when.map(types, function (type) {
		return getJson(type).then(function (data) {
			delete data[name];
			return writeJson(type, data);
		});
	});
}


function getXml(types, name) {
	var data = {};
	return when.all(types.map(function (type) {
		return getJson(type, name).then(function (typeData) {
			data[type] = typeData;
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
		return getJson(type, conn.params.name).then(function (data) {
			conn.json(data);
		});
	});

	routes.post("/" + type + ".json", function (conn) {
		return postJson(conn, types).then(function (name) {
			conn.redirect(303, type + "/" + name + ".json");
		});
	});

	routes.put("/" + type + ".json", function (conn) {
		return putJson(conn, type).then(function () {
			conn.file({ path: jsonFile(type) });
		});
	});

	routes.put("/" + type + "/:name.json", function(conn) {
		return putJson(conn, type, conn.params.name).then(function () {
			return getJson(type, conn.params.name);
		}).then(function (data) {
			conn.json(data);
		});
	});

	// app.delete - not a promise
	app.delete("/" + type + ".json", function (conn) {
		conn.text(403, 'Forbidden'); // I'm afraid I can't do that.
	});

	routes.delete("/" + type + "/:name.json", function (conn) {
		return deleteJson(types, conn.params.name).then(function () {
			conn.file({ path: jsonFile(type) });
		});
	});

	routes.get("/" + type + ".xml", function (conn) {
		return getXml([type]);
	});

	routes.get("/" + type + "/:name.xml", function (conn) {
		return getXml([type], conn.params.name, conn);
	});
});

routes.get("/all.xml", function (conn) {
	return getXml(types);
});

routes.get("/:name.xml", function (conn) {
	return getXml(types, conn.params.name);
});

app.options("*", function () {
	return "";
});

module.exports = app;
