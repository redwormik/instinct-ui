var mach = require("mach");


function apiRequest(that, method, data, name) {
	var url = that.settings.CUSTOM_SETTINGS.API_BASE_URL +
			that.apiName + (name ? "/" + name : "") + ".json";
	var options = { url: url };
	if (data) {
		options.params = Object.keys(data).reduce(function (memo, key) {
			memo[key] = JSON.stringify(data[key]);
			return memo;
		}, {});
	}
	return mach[method](options).then(function (conn) {
		return JSON.parse(conn.responseText);
	}).catch(function (e) {
		var error = method.toUppercase() + " " + url + " error: " + e.message;
		console.log(error);
		return null;
	});
}


module.exports = {
	apiGet: function (name) {
		return apiRequest(this, "get", null, name)
	},
	apiPost: function (data) {
		return apiRequest(this, "post", data)
	},
	apiPut: function (data, name) {
		return apiRequest(this, "put", data, name)
	},
	apiDelete: function (name) {
		return apiRequest(this, "delete", null, name)
	}
};
