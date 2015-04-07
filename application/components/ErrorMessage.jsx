var React = require("react");


var ErrorMessage = React.createClass({
	render: function () {
		return this.props.message ? (
			<div style={{ ...this.props.style, color: "white", background: "red", fontWeight: "bold" }}>
				Error: { this.props.message }
			</div>
		) : (
			<div style={{ ...this.props.style }}></div>
		);
	}
});

module.exports = ErrorMessage;
