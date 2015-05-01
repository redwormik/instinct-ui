var React = require("react");
var PureRenderMixin = require("react/addons").addons.PureRenderMixin;
var Link = require("react-router").Link;

var ErrorMessage = require("./ErrorMessage.jsx");


var NotFound = React.createClass({
	mixins: [ PureRenderMixin ],
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
