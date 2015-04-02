var throttle = require('../throttle.js');

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
				this.sendData();
				this.trigger(this.state);
			},
			sendData: throttle(function() {
				this.sendToAPI('components.json', {
					components: JSON.stringify(this.state)
				});
			}, 1000)
		},
			require('./mixins/getFromAPI.js'),
			require('./mixins/sendToAPI.js')
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
				this.sendData();
				this.trigger(this.state);
			},
			sendData: throttle(function() {
				this.sendToAPI('data.json', {
					data: JSON.stringify(this.state)
				});
			}, 1000)
		},
			require('./mixins/getFromAPI.js'),
			require('./mixins/sendToAPI.js')
		)
	},
};
