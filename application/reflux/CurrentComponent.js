

var CurrentComponent = {
	actions: ["getCurrentComponent"],
	store: {
		dependencies: { stores: ["Components"] },
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
		onGetCurrentComponent: function (current) {
			this.state = current;
			this.trigger(this.state);
		}
	}
}

module.exports = CurrentComponent;
