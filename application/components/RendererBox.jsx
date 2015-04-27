var Ambidex  = require("ambidex");
var React = require("react");
var Link = require("react-router").Link;
var Navigation = require("react-router").Navigation;

var ComponentMenu = require("./ComponentMenu.jsx");
var ComponentEditPanel = require("./ComponentEditPanel.jsx");
var Renderer = require("./Renderer.jsx");


var RendererBox = React.createClass({
	mixins: [
		Ambidex.mixinCreators.connectStoresToLocalState([
			"Components", "Data", "CurrentComponent"
		]),
		Navigation
	],
	getCurrent: function () {
		return this.state.currentComponent || Object.keys(this.state.components)[0];
	},
	componentDidUpdate: function (prevProps, prevState) {
		if ((created = this.getRefluxStore("Components").created)) {
			this.transitionTo("component", { component: created });
			return;
		}
		var name = this.state.currentComponent;
		if (!created && name !== prevState.currentComponent) {
			if (name) {
				this.transitionTo("component", { component: name });
			}
			else {
				this.transitionTo("main");
			}
		}
	},
	render: function () {
		var current = this.getCurrent();
		var component = this.state.components[current];
		var data = this.state.data[current] || {};
		var paneStyles = {
			width: "50%",
			height: "calc(100% - 32px)",
			padding: 8,
			boxSizing: "border-box",
			overflow: "auto"
		};
		return (
			<div style={ this.props.style }>
				<ComponentMenu components={ Object.keys(this.state.components) } current={ current } />
				<ComponentEditPanel name={ current } component={ component } data={ data }
					style={{ ...paneStyles, float: "left", width: "35%", borderRight: "1px solid black" }} />
				<Renderer root={ current } data={ data } components={ this.state.components }
					style={{ ...paneStyles, float: "right", width: "65%" }} />
				<div style={{ clear: "both" }} />
			</div>
		)
	}
});

module.exports = RendererBox;
