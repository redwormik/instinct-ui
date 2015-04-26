var React = require("react");


var HoldButton = React.createClass({
	getDefaultProps: function () {
		return { delay: 10 };
	},
	getInitialState: function () {
		return { mouseDown: false, timeoutId: null };
	},
	handleMouseDown: function () {
		this.setState({
			mouseDown: true,
			timeoutId: setInterval(this.buttonHeld, this.props.delay)
		});
	},
	handleMouseUp: function () {
		if (this.state.timeoutId) {
			clearInterval(this.state.timeoutId);
		}
		this.setState({
			mouseDown: false,
			timeoutId: null
		});
	},
	buttonHeld: function () {
		if (this.state.mouseDown) {
			this.props.onHold(this.props.delay);
		}
	},
	render: function () {
		var { delay, onHold, children, ...other } = this.props;
		return (
			<span { ...other } onMouseDown={ this.handleMouseDown } onMouseUp={ this.handleMouseUp }>
				{ children }
			</span>
		);
	}
});

module.exports = HoldButton;
