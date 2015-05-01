var Ambidex  = require("ambidex");
var React = require("react");
var PureRenderMixin = require("react/addons").addons.PureRenderMixin;
var Link = require("react-router").Link;
var Navigation = require("react-router").Navigation;

var ComponentMenu = require("./ComponentMenu.jsx");
var ComponentEditPanel = require("./ComponentEditPanel.jsx");
var Renderer = require("./Renderer.jsx");


var Main = React.createClass({
	mixins: [
		PureRenderMixin,
		Ambidex.mixinCreators.connectStoresToLocalState([
			"Components", "Data", "CurrentComponent"
		]),
		Navigation
	],
	getCurrent: function () {
		return this.state.currentComponent || Object.keys(this.state.components)[0];
	},
	componentDidUpdate: function (prevProps, prevState) {
		Object.keys(this.state.components).forEach(function (name) {
			if (prevState.components[name] === undefined) {
				this.transitionTo("component", { component: name });
				return;
			}
		}.bind(this));
		var name = this.state.currentComponent;
		if (name !== prevState.currentComponent) {
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
		var data = this.state.data[current];
		var paneStyles = {
			width: "50%",
			height: "calc(100% - 32px)",
			padding: 8,
			boxSizing: "border-box",
			overflow: "auto"
		};
		return (
			<div style={{ width: "100vw", height: "100vh" }}>
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

module.exports = Main;
