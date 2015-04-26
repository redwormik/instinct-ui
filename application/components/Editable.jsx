var React = require("react");


var Editable = React.createClass({
	getInitialState: function () {
		return { editing: false };
	},
	handleDoubleClick: function () {
		this.setState({ editing: true });
	},
	handleChange: function () {
		var text = this.refs.text.getDOMNode().value;
		this.props.onChange(text);
	},
	handleBlur: function () {
		this.setState({ editing: false });
	},
	componentDidUpdate: function () {
		if (this.state.editing) {
			var node = this.refs.text.getDOMNode();
			if (document && document.activeElement !== node) {
				node.focus();
				node.selectionStart = node.selectionEnd = node.value.length;
			}
		}
	},
	render: function () {
		var { text, onChange, style, ...other } = this.props;
		if (this.state.editing) {
			return (
				<input { ...other } type="text" value={ text } style={{ ...style, width: text.length * 9 }} ref="text"
					onChange={ this.handleChange } onBlur={ this.handleBlur } />
			);
		}
		else {
			return (
				<span style={ style } { ...other } onDoubleClick={ this.handleDoubleClick }>{ text }</span>
			);
		}
	}
});

module.exports = Editable;
