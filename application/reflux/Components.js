var assign = Object.assign || require("react/lib/Object.assign.js");


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
			this.state = null;
			this.parent.actions.renameComponent.shouldEmit = this.shouldRenameComponent;
		},
		onGetComponents: function () {
			this.loadData();
		},
		onCreateComponent: function () {
			this.apiPost({
				component: { root: "div", style: {}, children: "" }
			}).then(function (data) {
				this.state = assign({}, this.state, data);
				this.trigger(this.state);
			}.bind(this))
				.done();
		},
		onUpdateComponent: function (component, name) {
			this.sendData({ component: component }, name);
			var tmp = {};
			tmp[name] = component;
			this.state = assign({}, this.state, tmp);
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

			var oldState = this.state;
			this.state = Object.keys(this.state).reduce(function (memo, key) {
				if (key !== name) {
					memo[key] = oldState[key];
				}
				return memo;
			}, {});
			this.trigger(this.state);
		}
	}
}

module.exports = Components;
