var mach = require("mach");
var Promise = require('when/lib/Promise');
var fs = require("fs");


var app = mach.stack();

app.get("/components.json", function (conn) {
	var file = __dirname + "/../data/components.json";
	return conn.file({ path: file });
});

app.get("/data.json", function (conn) {
	var file = __dirname + "/../data/data.json";
	return conn.file({ path: file });
});

app.post("/components.json", function (conn) {
	var file = __dirname + "/../data/components.json";
	return conn.getParams({ components: String }).then(function (params) {
		return new Promise(function (resolve, reject) {
			var components = JSON.parse(params.components);
			fs.writeFile(file, JSON.stringify(components, null, "\t") + "\n", function (error, data) {
				error ? reject(error) : fs.readFile(file, function (error, data) {
					error ? reject(error) : resolve(data);
				});
			});
		});
	}).then(function () {
		conn.file(file);
	});
});

app.post("/data.json", function (conn) {
	var file = __dirname + "/../data/data.json";
	return conn.getParams({ data: String }).then(function (params) {
		return new Promise(function (resolve, reject) {
			var data = JSON.parse(params.data);
			fs.writeFile(file, JSON.stringify(data, null, "\t") + "\n", function (error, data) {
				error ? reject(error) : fs.readFile(file, function (error, data) {
					error ? reject(error) : resolve(data);
				});
			});
		});
	}).then(function () {
		conn.file(file);
	});
});

module.exports = app;
