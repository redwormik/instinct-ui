var mach = require('mach');
var Promise = require('mach/utils/Promise');
var fs = require('fs');

var app = mach.stack();


app.get('/components.json', function (request) {
	var file = __dirname + '/../data/components.json';
	return request.file({ path: file });
});

app.get('/data.json', function (request) {
	var file = __dirname + '/../data/data.json';
	return request.file({ path: file });
});


module.exports = app;
