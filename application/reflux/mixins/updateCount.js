

module.exports = {
	updateStart: function () {
		this.updating = (this.updating || 0) + 1;
	},
	updateFinish: function () {
		this.updating = this.updating - 1;
	}
}
