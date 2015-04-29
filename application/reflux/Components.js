

var Components = {
	actions: ["getComponents", "createComponent", "updateComponent", "renameComponent", "deleteComponent"],
	store: {
		mixins: [
			require("./mixins/apiCalls.js"),
			require("./mixins/updateCount.js"),
			require("./mixins/loadSendData.js"),
			require("./mixins/rename.js")
		],
		apiName: "components",
		init: function () {
			this.state = {};
			this.created = null;
			this.parent.actions.renameComponent.shouldEmit = this.shouldRenameComponent;
		},
		onGetComponents: function () {
			this.created = null;
			this.loadData();
		},
		onCreateComponent: function () {
			this.apiPost({ component: {root: "div", style: {}} }).then(function (data) {
				Object.keys(data).forEach(function (name) {
					this.state[name] = data[name];
					this.created = name;
				}.bind(this));
				this.trigger(this.state);
				// TODO: update Data?
			}.bind(this))
			.done();
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
			this.updateStart();
			var dataStore = this.parent.stores.Data;
			this.apiDelete(name)
				.finally(this.updateFinish)
				.finally(dataStore.updateFinish)
				.done();
			delete this.state[name];
			this.trigger(this.state);
		}
	}
}

module.exports = Components;
