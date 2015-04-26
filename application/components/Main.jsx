var React = require("react");

var RendererBox = require("./RendererBox.jsx");


var Main = React.createClass({
	render: function () {
		return (
			<RendererBox style={{ width: "100vw", height: "100vh" }}/>
		);
	}
});

module.exports = Main;
