var React = require("react");
var RendererBox = require("./RendererBox.jsx");

var Home = React.createClass({
	render: function () {
		return (
			<div className="Home">
				<RendererBox />
			</div>
		);
	}
});

module.exports = Home;
