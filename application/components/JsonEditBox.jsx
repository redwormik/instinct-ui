var React = require("react");
var neon = require("neon-js");

var ErrorMessage = require("./ErrorMessage.jsx");


var JsonEditBox = React.createClass({
	getInitialState: function () {
		return {
			text: this.dump(this.props.data),
			error: null,
			textToBe: null,
			focused: false
		};
	},
	componentWillReceiveProps: function (nextProps) {
		if (this.props.data !== nextProps.data) {
			if (this.state.focused) {
				this.setState({ textToBe: this.dump(nextProps.data) });
			}
			else {
				this.setState({ text: this.dump(nextProps.data), error: null, textToBe: null });
			}
		}
	},
	dump: function (data) {
		return JSON.stringify(data, null, 2);
	},
	processNeon: function (data) {
		if (!(data instanceof neon.Map)) {
			return data;
		}
		var values = data.isList() && data.length > 0 ? [] : {};
		data.forEach(function (key, value) {
			values[key] = this.processNeon(value);
		}.bind(this));
		return values;
	},
	handleChange: function () {
		var text = this.refs.text.getDOMNode().value;
		try {
			var data = this.processNeon(neon.decode(text));
			this.setState({ text: text, error: null, textToBe: null });
			this.props.onChange(data);
		} catch (ex) {
			if (ex instanceof neon.Error)
				this.setState({ text: text, error: ex.message, textToBe: null });
			else
				throw ex;
		}
	},
	handleFocus: function () {
		this.setState({ focused: true });
	},
	handleBlur: function() {
		if (this.state.textToBe) {
			this.setState({ text: this.state.textToBe, error: null, textToBe: null, focused: false });
		}
		else {
			this.setState({ focused: false });
		}
	},
	render: function () {
		var errorStyle = {
			height: 20,
			overflow: "auto",
			marginBottom: 5
		};
		return (
			<div style={ this.props.style }>
				<ErrorMessage style={ errorStyle } message={ this.state.error } />
				<textarea ref="text" value={ this.state.text } autoComplete="off"
					onChange={ this.handleChange } onFocus={ this.handleFocus } onBlur={ this.handleBlur }
					style={{ width: "100%", height: "calc(100% - 30px)", boxSizing: "border-box" }} />
			</div>
		);
	}
});

module.exports = JsonEditBox;
