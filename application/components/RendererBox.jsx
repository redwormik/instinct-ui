var Ambidex  = require("ambidex");
var React = require("react");

var JsonEditBox = require("./JsonEditBox.jsx");
var Renderer = require("./Renderer.jsx");


var RendererBox = React.createClass({
	mixins: [
		Ambidex.mixinCreators.connectStoresToLocalState(["Components", "Data", "Root"])
	],
	rootChanged: function () {
		this.getRefluxAction("updateRoot")(this.refs.root.getDOMNode().value);
	},
	dataChanged: function (data) {
	},
	render: function () {
		var root = this.state.root || (Object.keys(this.state.components)[0]);
		var options = Object.keys(this.state.components).map(function (name) {
			return (
				<option value={ name } key={ name }>{ name }</option>
			);
		});
		var paneStyles = {
			width: "50%",
			height: "100%",
			padding: 8,
			boxSizing: "border-box",
			overflow: "auto"
		};
		return (
			<div style={ this.props.style }>
				<div style={{ ...paneStyles, float: "left" }}>
					<div style={{ height: 30 }}>
						<select value={ root } onChange={ this.rootChanged } ref="root">
							{ options }
						</select>
					</div>
					<JsonEditBox data={ this.state.components }
						onChange={ this.getRefluxAction("updateComponents") }
						style={{ width: "100%", height: "calc(50% - 15px)" }} />
					<JsonEditBox data={ this.state.data }
						onChange={ this.getRefluxAction("updateData") }
						style={{ width: "100%", height: "calc(50% - 15px)" }} />
				</div>
				<div style={{ ...paneStyles, float: "right" }}>
					<Renderer root={ root } data={ this.state.data } components={ this.state.components } />
				</div>
				<div style={{ clear: "both" }} />
			</div>
		)
	}
});

module.exports = RendererBox;
