

var Data = {
	dependencies: { actions: ["renameComponent", "deleteComponent"] },
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
			this.state = {};
			this.listenTo(this.parent.actions.renameComponent, this.onRenameComponent);
			this.listenTo(this.parent.actions.deleteComponent, this.onDeleteComponent);
		},
		onGetData: function () {
			this.loadData();
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
			this.updateStart();
			delete this.state[name];
			this.trigger(this.state);
			// updateFinished called from Component when API call finishes
		}
	}
}

module.exports = Data;
