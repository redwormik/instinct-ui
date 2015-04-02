var Ambidex = require("ambidex");
var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var Link = require("react-router").Link;


var Main = React.createClass({
	mixins: [
		Ambidex.mixins.Title
	],
	sectionTitle: "MI-DIP app",
	render: function () {
		return (
			<div className="Main">
				<nav>
					<ul>
						<li><Link to="main">Home</Link></li>
						<li><Link to="page">Page</Link></li>
					</ul>
				</nav>
				<RouteHandler />
			</div>
		);
	}
});

module.exports = Main;
