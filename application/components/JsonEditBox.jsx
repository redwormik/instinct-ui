var React = require("react");

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
				this.setState({ text: this.dump(nextProps.data), textToBe: null });
			}
		}
	},
	dump: function (data) {
		return JSON.stringify(data, null, 2);
	},
	handleChange: function () {
		var text = this.refs.text.getDOMNode().value;
		try {
			var obj = JSON.parse(text);
			this.setState({ text: text, error: null, textToBe: null });
			this.props.onChange(obj);
		} catch (ex) {
			if (ex instanceof SyntaxError && ex.message.startsWith("JSON.parse: ")) {
				var message = ex.message.slice(12, ex.message.endsWith(" of the JSON data") ? -17 : undefined);
				this.setState({ text: text, error: message, textToBe: null });
			}
			else {
				throw ex;
			}
		}
	},
	handleFocus: function () {
		this.setState({ focused: true });
	},
	handleBlur: function() {
		if (this.state.textToBe) {
			this.setState({ text: this.state.textToBe, textToBe: null, focused: false });
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
