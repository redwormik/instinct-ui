var Ambidex = require("ambidex");
var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

var Main = React.createClass({
	mixins: [
		Ambidex.mixins.Title
	],
	titleSection: 'MI-DIP app',
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
