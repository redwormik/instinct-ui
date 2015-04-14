var React = require("react");
var Link = require("react-router").Link;

var ErrorMessage = require("./ErrorMessage.jsx");


var NotFound = React.createClass({
	render: function () {
		return (
			<div style={{ margin: 8 }}>
				<ErrorMessage message="Page not found!" />
				<p><Link to="main">Return to homepage</Link></p>
			</div>
		);
	}
});

module.exports = NotFound;
