var Ambidex  = require("ambidex");
var React = require("react");

var Input = require("./Input.jsx");
var JsonEditBox = require("./JsonEditBox.jsx");


var ComponentEditPanel = React.createClass({
	mixins: [ Ambidex.mixins.Reflux ],
	nameChanged: function (newName) {
		this.getRefluxAction("renameComponent")(newName, this.props.name);
	},
	handleDeleteClick: function () {
		var confirm = "Are you sure you want to delete " + this.props.name + "?";
		if (window && !window.confirm(confirm)) {
			return;
		}
		this.getRefluxAction("deleteComponent")(this.props.name);
	},
	componentChanged: function (component) {
		this.getRefluxAction("updateComponent")(component, this.props.name);
	},
	dataChanged: function (data) {
		this.getRefluxAction("updateData")(data, this.props.name);
	},
	render: function() {
		if (this.props.component === undefined) {
			return <div style={ this.props.style } />;
		}

		var inputStyle = {
			width: "calc(100% - 25px)",
			height: 25,
			boxSizing: "border-box",
			marginBottom: 5
		};
		var deleteStyle = {
			color: "red",
			fontWeight: "bold",
			display: "inline-block",
			width: 25,
			height: 25,
			textAlign: "center",
			cursor: "pointer"
		};
		var editBoxStyle = { width: "100%", height: "calc(50% - 15px)" };

		return (
			<div style={ this.props.style }>
				<Input value={ this.props.name } onChange={ this.nameChanged } style={ inputStyle } />
				<span onClick={ this.handleDeleteClick } style={ deleteStyle }>&times;</span>

				<JsonEditBox data={ this.props.component }
					onChange={ this.componentChanged } style={ editBoxStyle } />

				<JsonEditBox data={ this.props.data }
					onChange={ this.dataChanged } style={ editBoxStyle } />
			</div>
		);
	}
});

module.exports = ComponentEditPanel;
