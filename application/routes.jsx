var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;


module.exports = (
	<Route name="main" path="/" handler={ require("./components/Main.jsx") }>
		<DefaultRoute handler={ require("./components/Home.jsx") } />
	</Route>
);
