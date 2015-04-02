var mach = require("mach");


module.exports = {
	sendToAPI: function (path, data) {
		return mach.post({
			url: this.settings.CUSTOM_SETTINGS.API_BASE_URL + path,
			params: data
		});
	}
};
