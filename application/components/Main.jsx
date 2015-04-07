var Ambidex = require("ambidex");
var React = require("react");
var RouteHandler = require("react-router").RouteHandler;


var Main = React.createClass({
	mixins: [
		Ambidex.mixins.Title
	],
	sectionTitle: "Instinct UI",
	render: function () {
		return (
			<RouteHandler />
		);
	}
});

module.exports = Main;
