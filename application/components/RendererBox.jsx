var Ambidex  = require("ambidex");
var React = require("react");

var JsonEditBox = require("./JsonEditBox.jsx");
var Renderer = require("./Renderer.jsx");


var RendererBox = React.createClass({
	mixins: [
		Ambidex.mixinCreators.connectStoresToLocalState(["Components", "Data"])
	],
	render: function () {
		var paneStyles = {
			width: "50vw",
			height: "100vh",
			padding: 8,
			boxSizing: "border-box"
		};
		return (
			<div>
				<div style={{ ...paneStyles, float: "left" }}>
					<JsonEditBox data={ this.state.components }
						onChange={ this.getRefluxAction("updateComponents") }
						style={{ width: "100%", height: "50%" }} />
					<JsonEditBox data={ this.state.data }
						onChange={ this.getRefluxAction("updateData") }
						style={{ width: "100%", height: "50%" }} />
				</div>
				<div style={{ ...paneStyles, float: "right", overflow: "auto" }}>
					<Renderer data={ this.state.data } components={ this.state.components } />
				</div>
				<div style={{ clear: "both" }} />
			</div>
		)
	}
});

module.exports = RendererBox;
