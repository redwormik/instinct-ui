var throttle = require("../throttle.js");
var assign = Object.assign || require("react/lib/Object.assign.js");


module.exports = {
	Components: {
		actions: ["getComponents", "updateComponents"],
		store: assign({
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
		},
			require("./mixins/getFromAPI.js"),
			require("./mixins/sendToAPI.js")
		)
	},
	Data: {
		actions: ["getData", "updateData"],
		store: assign({
			init: function () {
				this.state = {};
			},
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
		},
			require("./mixins/getFromAPI.js"),
			require("./mixins/sendToAPI.js")
		)
	},
	Root: {
		actions: ["updateRoot"],
		store: {
			dependencies: { actions: ["getComponents"], stores: ["Components"] },
			init: function () {
				this.state = null;
				this.listenTo(this.parent.stores.Components, this.checkEmptyRoot);
			},
			checkEmptyRoot: function (components) {
				var keys = Object.keys(components);
				if (this.state === null && keys.length > 0) {
					this.onUpdateRoot(keys[0]);
				}
			},
			onUpdateRoot: function (root) {
				this.state = root;
				this.trigger(this.state);
			}
		}
	}
};
