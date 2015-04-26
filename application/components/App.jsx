var Ambidex = require("ambidex");
var React = require("react");
var RouteHandler = require("react-router").RouteHandler;


var App = React.createClass({
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

module.exports = App;
