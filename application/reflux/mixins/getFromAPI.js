var mach = require("mach");


module.exports = {
	getFromAPI: function (path) {
		var url = this.settings.CUSTOM_SETTINGS.API_BASE_URL + path;
		return mach.get(url).then(function (connection) {
			return JSON.parse(connection.responseText);
		}).catch(function (e) {
			var error = "Error fetching " + url + ": " + e.message;
			console.log(error);
			return {};
		});
	}
};
