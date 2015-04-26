var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;


module.exports = (
	<Route name="main" path="/" handler={ require("./components/App.jsx") }>
		<DefaultRoute handler={ require("./components/Home.jsx") } />
		<NotFoundRoute handler={ require("./components/NotFound.jsx") } />
	</Route>
);
