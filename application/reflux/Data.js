var throttle = require("../throttle.js");


var Data = {
	actions: ["getData", "updateData"],
	store: {
		init: function () {
			this.state = {};
		},
		mixins: [
			require("./mixins/getFromAPI.js"),
			require("./mixins/sendToAPI.js")
		],
		onGetData: function () {
			this.getFromAPI("data.json").then(function (data) {
				this.state = data;
				this.trigger(this.state);
			}.bind(this));
		},
		onUpdateData: function (data) {
			this.state = data;
			this.sendData();
			this.trigger(this.state);
		},
		sendData: throttle(function () {
			this.sendToAPI("data.json", {
				data: JSON.stringify(this.state)
			});
		}, 1000)
	}
}

module.exports = Data;
