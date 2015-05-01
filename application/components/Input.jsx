var React = require("react");
var PureRenderMixin = require("react/addons").addons.PureRenderMixin;


var Input = React.createClass({
	mixins: [ PureRenderMixin ],
	getInitialState: function () {
		return { value: this.props.value };
	},
	componentWillReceiveProps: function (newProps) {
		if (!this.state.focused) {
			this.setState({ value: newProps.value });
		}
	},
	handleChange: function () {
		var value = this.refs.input.getDOMNode().value;
		this.setState({ value: value });
		if (this.props.onChange) {
			this.props.onChange(value);
		}
	},
	handleFocus: function () {
		this.setState({ focused: true });
	},
	handleBlur: function () {
		this.setState({ value: this.props.value, focused: false });
	},
	render: function () {
		return (
			<input value={ this.state.value } style={ this.props.style }
				onChange={ this.handleChange } onBlur={ this.handleBlur } ref="input" />
		);
	}
});

module.exports = Input;
