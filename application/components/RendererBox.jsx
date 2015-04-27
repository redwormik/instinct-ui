var Ambidex  = require("ambidex");
var React = require("react");
var Link = require("react-router").Link;
var assign = Object.assign || require("react/lib/Object.assign.js");

var ComponentMenu = require("./ComponentMenu.jsx");
var JsonEditBox = require("./JsonEditBox.jsx");
var Renderer = require("./Renderer.jsx");


var RendererBox = React.createClass({
	mixins: [
		Ambidex.mixinCreators.connectStoresToLocalState(["Components", "Data", "CurrentComponent"])
	],
	componentsChanged: function (components) {
		this.getRefluxAction("updateComponent")(components, this.state.currentComponent);
	},
	dataChanged: function (data) {
		this.getRefluxAction("updateData")(data, this.state.currentComponent);
	},
	render: function () {
		var root = this.state.currentComponent;
		var currentComponent = this.state.components[root] || {};
		var currentData = this.state.data[root] || {};
		var paneStyles = {
			width: "50%",
			height: "calc(100% - 32px)",
			padding: 8,
			boxSizing: "border-box",
			overflow: "auto"
		};
		return (
			<div style={ this.props.style }>
				<ComponentMenu components={ Object.keys(this.state.components) } current={ root } />
				<div style={{ ...paneStyles, float: "left", width: "35%", borderRight: "1px solid black" }}>
					<JsonEditBox data={ currentComponent }
						onChange={ this.componentsChanged }
						style={{ width: "100%", height: "50%" }} />
					<JsonEditBox data={ currentData }
						onChange={ this.dataChanged }
						style={{ width: "100%", height: "50%" }} />
				</div>
				<div style={{ ...paneStyles, float: "right", width: "65%" }}>
					<Renderer root={ root } data={ currentData } components={ this.state.components } />
				</div>
				<div style={{ clear: "both" }} />
			</div>
		)
	}
});

module.exports = RendererBox;
