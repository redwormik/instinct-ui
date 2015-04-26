var throttle = require("../throttle.js");


var Components = {
	actions: ["getComponents", "updateComponents"],
	store: {
		mixins: [
			require("./mixins/getFromAPI.js"),
			require("./mixins/sendToAPI.js")
		],
		init: function () {
			this.state = {};
		},
		onGetComponents: function () {
			this.getFromAPI("components.json").then(function (data) {
				this.state = data;
				this.trigger(this.state);
			}.bind(this));
		},
		onUpdateComponents: function (components) {
			this.state = components;
			this.sendData();
			this.trigger(this.state);
		},
		sendData: throttle(function () {
			this.sendToAPI("components.json", {
				components: JSON.stringify(this.state)
			});
		}, 1000)
	}
}

module.exports = Components;
