var Ambidex = require("ambidex");
var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var Link = require("react-router").Link;


var Main = React.createClass({
	mixins: [
		Ambidex.mixins.Title
	],
	sectionTitle: "Instinct UI",
	render: function () {
		return (
			<div className="Main">
				<RouteHandler />
			</div>
		);
	}
});

module.exports = Main;
