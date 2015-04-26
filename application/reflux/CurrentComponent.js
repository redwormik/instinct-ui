

var CurrentComponent = {
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
				this.state = keys[0];
				this.trigger(this.state);
			}
		},
		onUpdateRoot: function (root) {
			this.state = root;
			this.trigger(this.state);
		}
	}
}

module.exports = CurrentComponent;
