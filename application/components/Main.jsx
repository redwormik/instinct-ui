var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

var Main = React.createClass({
	render: function () {
		return (
			<div className="Main">
				<nav>This is the nav</nav>
				<RouteHandler />
			</div>
		);
	}
});

module.exports = Main;
