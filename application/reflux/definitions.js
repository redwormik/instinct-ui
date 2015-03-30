module.exports = {
	Components: {
		actions: ['getComponents', 'updateComponents'],
		store: Object.assign({
			counter: 0,
			init: function() {
				this.state = {};
			},
			onGetComponents: function() {
				this.getFromAPI('components.json').then(data => {
					this.state = data;
					this.trigger(this.state);
				});
			},
			onUpdateComponents: function(components) {
				this.state = components;
				this.trigger(this.state);
			}
		},
			require('./mixins/getFromAPI.js')
		)
	},
	Data: {
		actions: ['getData', 'updateData'],
		store: Object.assign({
			init: function() {
				this.state = {};
			},
			onGetData: function() {
				this.getFromAPI('data.json').then(data => {
					this.state = data;
					this.trigger(this.state);
				});
			},
			onUpdateData: function(data) {
				this.state = data;
				this.trigger(this.state);
			}
		},
			require('./mixins/getFromAPI.js')
		)
	},
};
