var Ambidex  = require("ambidex");
var React = require("react");
var assign = Object.assign || require("react/lib/Object.assign.js");

var JsonEditBox = require("./JsonEditBox.jsx");
var Renderer = require("./Renderer.jsx");


var RendererBox = React.createClass({
	mixins: [
		Ambidex.mixinCreators.connectStoresToLocalState(["Components", "Data", "Root"])
	],
	rootChanged: function (root) {
		this.getRefluxAction("updateRoot")(root);
	},
	componentsChanged: function (components) {
		var newComponents = assign({}, this.state.components);
		newComponents[this.state.root] = components;
		this.getRefluxAction("updateComponents")(newComponents);
	},
	dataChanged: function (data) {
		var newData = assign({}, this.state.data);
		newData[this.state.root] = data;
		this.getRefluxAction("updateData")(newData);
	},
	render: function () {
		var root = this.state.root;
		var currentComponent = this.state.components[root] || {};
		var currentData = this.state.data[root] || {};
		var options = Object.keys(this.state.components).map(function (name) {
			var style = {
				marginLeft: 8,
				padding: "2px 3px 0 3px",
				cursor: "pointer",
				border: "1px solid black",
				borderBottom: "none",
				background: name === root ? "#aaa" : "#fff",
				width: "auto",
				float: "left",
				boxSizing: "border-box",
				height: 23
			};
			return (
				<div style={ style } onClick={ this.rootChanged.bind(this, name) } key={ name }>{ name }</div>
			);
		}.bind(this));
		var paneStyles = {
			width: "50%",
			height: "calc(100% - 32px)",
			padding: 8,
			boxSizing: "border-box",
			overflow: "auto"
		};
		return (
			<div style={ this.props.style }>
				<div style={{ paddingTop: 8, height: 32, boxSizing: "border-box", overflow: "auto", borderBottom: "1px solid black" }}>
					{ options }
					<div style={{ clear: "both" }} />
				</div>
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
