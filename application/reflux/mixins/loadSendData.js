var throttle = require("../../throttle.js");


module.exports = {
	loadData: function () {
		this.loadDataThrottle = this.loadDataThrottle || throttle(60000, false);

		var empty = !this.state;
		if (!empty && this.updating) return;

		(empty ? this.apiGet() : this.loadDataThrottle().then(this.apiGet))
			.then(function (data) {
				if (!empty && this.updating) return;
				this.state = data;
				this.trigger(this.state);
			}.bind(this), function () { /* throttle rejected */ })
			.done();
	},
	sendData: function (data, name) {
		this.sendDataThrottle = this.sendDataThrottle || throttle(1000, true);

		this.updateStart();
		this.sendDataThrottle()
			.then(function () {
				return this.apiPut(data, name);
			}.bind(this), function () { /* throttle rejected */ })
			.finally(this.updateFinish)
			.done();
	}
};
