

var CurrentComponent = {
	dependencies: { actions: ["renameComponent", "deleteComponent"] },
	actions: ["getCurrentComponent"],
	store: {
		init: function () {
			this.state = null;
			this.listenTo(this.parent.actions.renameComponent, this.onRenameComponent);
			this.listenTo(this.parent.actions.deleteComponent, this.onDeleteComponent);
		},
		onGetCurrentComponent: function (current) {
			this.state = current;
			this.trigger(this.state);
		},
		onRenameComponent: function (newName, oldName) {
			if (this.state && this.state === oldName) {
				this.state = newName;
				this.trigger(this.state);
			}
		},
		onDeleteComponent: function (name) {
			if (this.state && this.state === name) {
				this.state = null;
				this.trigger(this.state);
			}
		}
	}
}

module.exports = CurrentComponent;
