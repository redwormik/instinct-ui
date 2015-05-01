var assign = Object.assign || require("react/lib/Object.assign.js");


var Data = {
	dependencies: {
		stores: ["Components"],
		actions: ["renameComponent", "deleteComponent"]
	},
	actions: ["getData", "updateData"],
	store: {
		mixins: [
			require("./mixins/apiCalls.js"),
			require("./mixins/updateCount.js"),
			require("./mixins/loadSendData.js"),
			require("./mixins/rename.js")
		],
		apiName: "data",
		init: function () {
			this.state = null;
			this.listenTo(this.parent.stores.Components, this.componentsUpdated);
			this.listenTo(this.parent.actions.renameComponent, this.onRenameComponent);
			this.listenTo(this.parent.actions.deleteComponent, this.onDeleteComponent);
		},
		onGetData: function () {
			this.loadData();
		},
		onUpdateData: function (data, name) {
			this.sendData({ data: data }, name);
			var tmp = {};
			tmp[name] = data;
			this.state = assign({}, this.state, tmp);
			this.trigger(this.state);
		},
		componentsUpdated: function (components) {
			if (!this.state) {
				return; // not yet loaded
			}
			var newComponents = Object.keys(components).reduce(function (memo, name) {
				if (this.state[name] === undefined) {
					memo[name] = {};
				}
				return memo;
			}.bind(this), {});
			if (Object.keys(newComponents).length > 0) {
				this.state = assign({}, this.state, newComponents);
				this.trigger(this.state);
			}
		},
		onRenameComponent: function (newName, oldName) {
			var data = this.renameRoots(newName, oldName,
				this.renameKeys(newName, oldName, this.state)
			);
			this.sendData({ data: data });
			this.state = data;
			this.trigger(this.state, newName, oldName);
		},
		onDeleteComponent: function (name) {
			if (this.state[name] === undefined) {
				return;
			}
			this.updateStart();
			var oldState = this.state;
			this.state = Object.keys(this.state).reduce(function (memo, key) {
				if (key !== name) {
					memo[key] = oldState[key];
				}
				return memo;
			}, {});
			this.trigger(this.state, name);
			// updateFinished called from Component when API call finishes
		}
	}
}

module.exports = Data;
