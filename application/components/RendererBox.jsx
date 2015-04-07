var Ambidex  = require("ambidex");
var React = require("react");

var JsonEditBox = require("./JsonEditBox.jsx");
var Renderer = require("./Renderer.jsx");


var RendererBox = React.createClass({
	mixins: [
		Ambidex.mixinCreators.connectStoresToLocalState(["Components", "Data"])
	],
	render: function () {
		return (
			<div style={{ height: "100%" }}>
				<div style={{ width: "49%", float: "right", height: "100%" }}>
					<Renderer data={ this.state.data } components={ this.state.components } />
				</div>
				<div style={{ width: "49%", float: "left", height: "100%" }}>
					<JsonEditBox data={ this.state.components }
						onChange={ this.getRefluxAction("updateComponents") }
						style={{ width: "100%", height: "50%" }} />
					<JsonEditBox data={ this.state.data }
						onChange={ this.getRefluxAction("updateData") }
						style={{ width: "100%", height: "50%" }}  />
				</div>
				<div style={{ clear: "both" }} />
			</div>
		)
	}
});

module.exports = RendererBox;
