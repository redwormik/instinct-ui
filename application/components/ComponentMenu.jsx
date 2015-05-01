var Ambidex  = require("ambidex");
var React = require("react");
var PureRenderMixin = require("react/addons").addons.PureRenderMixin;
var Link = require("react-router").Link;
var assign = Object.assign || require("react/lib/Object.assign.js");

var HoldButton = require("./HoldButton.jsx");


var ComponentMenu = React.createClass({
	mixins: [ PureRenderMixin, Ambidex.mixins.Reflux ],
	handleWheel: function (event) {
		var node = this.refs.scrolling.getDOMNode();
		node.scrollLeft += (event.deltaY * 16);
		event.preventDefault();
	},
	scrollLeftHeld: function (deltaTime) {
		var node = this.refs.scrolling.getDOMNode();
		node.scrollLeft -= deltaTime / 2;
	},
	scrollRightHeld: function (deltaTime) {
		var node = this.refs.scrolling.getDOMNode();
		node.scrollLeft += deltaTime / 2;
	},
	render: function() {
		var border = "1px solid black";
		var style = {
			width: "100%",
			height: 32,
			boxSizing: "border-box",
			borderBottom: border,
			padding: 8,
			paddingBottom: 0
		};
		var clickableStyle = {
			display: "inline-block",
			height: 23,
			boxSizing: "border-box",
			borderTop: border,
			borderRight: border,
			cursor: "pointer"
		};
		var buttonStyle = assign({}, clickableStyle, {
			width: 24,
			float: "right",
			textAlign: "center"
		});
		var linkStyle = assign({}, clickableStyle, {
			width: "auto",
			padding: "2px 3px 0 3px",
			color: "inherit",
			textDecoration: "inherit",
			textAlign: "center"
		});

		var links = this.props.components ? this.props.components.map(function (name, index, names) {
			var style = assign({}, linkStyle, {
				background: name === this.props.current ? "#aaa" : "#fff",
				marginLeft: index === 0 ? 8 : null,
				marginRight: index === names.length - 1 ? 8 : null,
				borderLeft: index === 0 ? border : null
			});
			return (
				<Link to="component" params={{ component: name }} style={ style } key={ name }>
					{ name }
				</Link>
			);
		}.bind(this)) : null;

		return (
			<div style={ style }>
				<div onClick={ this.getRefluxAction("createComponent") }
					style={{ ...buttonStyle, float: "left", borderLeft: border }}>+</div>
				<HoldButton onHold={ this.scrollRightHeld }
					style={ buttonStyle }>&#x25b6;</HoldButton>
				<HoldButton onHold={ this.scrollLeftHeld }
					style={{ ...buttonStyle, borderLeft: border }}>&#x25c0;</HoldButton>
				<div onWheel={ this.handleWheel } style={{ overflow: "hidden" }} ref="scrolling">
					<div style={{ width: "auto", whiteSpace: "nowrap" }}>
						{ links }
					</div>
				</div>
				<div style={{ clear: "both", height: 0, overflow: "hidden" }} />
			</div>
		);
	}
});

module.exports = ComponentMenu;
