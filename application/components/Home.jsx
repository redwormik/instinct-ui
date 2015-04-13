var React = require("react");

var RendererBox = require("./RendererBox.jsx");


var Home = React.createClass({
	render: function () {
		return (
			<RendererBox style={{ width: "100vw", height: "100vh" }}/>
		);
	}
});

module.exports = Home;
