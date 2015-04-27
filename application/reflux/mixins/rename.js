

module.exports = {
	renameKeys: function (newName, oldName, data) {
		return Object.keys(data).reduce(function (memo, key) {
			memo[key === oldName ? newName : key] = data[key];
			return memo;
		}, {});
	},
	renameRoots: function (newName, oldName, data, key) {
		if (data === null || typeof data !== "object") {
			return key === "root" && data === oldName ? newName : data;
		}
		if (Array.isArray(data)) {
			return data.map(this.renameRoots.bind(this, newName, oldName));
		}
		return Object.keys(data).reduce(function (memo, key) {
			memo[key] = this.renameRoots(newName, oldName, data[key], key);
			return memo;
		}.bind(this), {});
	},
}
