var React = require("react");
var RendererBox = require("./RendererBox.jsx");


var Home = React.createClass({
	render: function () {
		return (
			<div className="Home">
				<RendererBox url="http://127.0.0.1:8080/api" />
			</div>
		);
	}
});

module.exports = Home;
