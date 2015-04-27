var throttle = require("../throttle.js");


var Components = {
	actions: ["getComponents", "createComponent", "updateComponent", "renameComponent", "deleteComponent"],
	store: {
		mixins: [
			require("./mixins/apiCalls.js"),
			require("./mixins/rename.js")
		],
		apiName: "components",
		init: function () {
			this.state = {};
			this.loadDataImmediate = this.loadData;
			this.loadData = throttle(this.loadData, 60000, false);
			this.sendData = throttle(this.sendData, 1000, true);
			this.parent.actions.renameComponent.shouldEmit = this.shouldRenameComponent;
		},
		onGetComponents: function () {
			this.created = null;
			if (!(Object.keys(this.state).length > 0)) {
				this.loadDataImmediate();
			}
			else {
				this.loadData();
			}
		},
		onCreateComponent: function () {
			this.apiPost({ component: {} }).then(function (data) {
				Object.keys(data).forEach(function (name) {
					this.state[name] = data[name];
					this.created = name;
				}.bind(this));
				this.trigger(this.state);
				// TODO: update Data?
			}.bind(this));
		},
		onUpdateComponent: function (component, name) {
			this.sendData({ component: component }, name);
			this.state[name] = component;
			this.trigger(this.state);
		},
		shouldRenameComponent: function (newName, oldName) {
			return newName !== oldName && /^[A-Z]/.exec(newName) &&
				this.state[newName] === undefined;
		},
		onRenameComponent: function (newName, oldName) {
			var components = this.renameRoots(newName, oldName,
				this.renameKeys(newName, oldName, this.state)
			);
			this.sendData({ components: components });
			this.state = components;
			this.trigger(this.state);
		},
		onDeleteComponent: function (name) {
			this.apiDelete(name);
			delete this.state[name];
			this.trigger(this.state);
		},
		loadData: function () {
			return this.apiGet().then(function (data) {
				this.state = data;
				this.trigger(this.state);
			}.bind(this));
		},
		sendData: function (data, name) {
			return this.apiPut(data, name);
		}
	}
}

module.exports = Components;
