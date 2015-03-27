require("node-jsx").install({
	"extension": ".js",
	"harmony": true
});

var React = require("react");
var Router = require("react-router");
var routes = require("./application/routes.jsx");

Router.run(routes, function (Handler) {
	var result = React.renderToString(React.createElement(Handler));
	console.log(result);
});
