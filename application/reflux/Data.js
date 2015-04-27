var throttle = require("../throttle.js");


var Data = {
	dependencies: { actions: ["renameComponent", "deleteComponent"] },
	actions: ["getData", "updateData"],
	store: {
		mixins: [
			require("./mixins/apiCalls.js"),
			require("./mixins/rename.js")
		],
		apiName: "data",
		init: function () {
			this.state = {};
			this.loadDataImmediate = this.loadData;
			this.loadData = throttle(this.loadData, 60000, false);
			this.sendData = throttle(this.sendData, 1000, true);
			this.listenTo(this.parent.actions.renameComponent, this.onRenameComponent);
			this.listenTo(this.parent.actions.deleteComponent, this.onDeleteComponent);
		},
		onGetData: function () {
			if (!(Object.keys(this.state).length > 0)) {
				this.loadDataImmediate();
			}
			else {
				this.loadData();
			}
		},
		onUpdateData: function (data, name) {
			this.sendData({ data: data }, name);
			this.state[name] = data;
			this.trigger(this.state);
		},
		onRenameComponent: function (newName, oldName) {
			var data = this.renameRoots(newName, oldName,
				this.renameKeys(newName, oldName, this.state)
			);
			this.sendData({ data: data });
			this.state = data;
			this.trigger(this.state);
		},
		onDeleteComponent: function (name) {
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

module.exports = Data;
