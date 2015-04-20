var mach = require("mach");


module.exports = {
	sendToAPI: function (path, data) {
		var url = this.settings.CUSTOM_SETTINGS.API_BASE_URL + path;
		return mach.post({ url: url, params: data }).catch(function (e) {
			var error = "Error sending data to " + url + ": " + e.message;
			console.log(error);
		});
	}
};
