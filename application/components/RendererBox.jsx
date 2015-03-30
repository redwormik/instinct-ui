var Ambidex  = require("ambidex");
var React = require("react");
var Renderer = require("./Renderer.jsx");

var RendererBox = React.createClass({
	mixins: [
		Ambidex.mixinCreators.connectStoresToLocalState(['Components', 'Data'])
	],
	onComponentsChange: function() {
		var text = this.refs.components.getDOMNode().value;
		this.getRefluxAction('updateComponents')(JSON.parse(text));
	},
	onDataChange: function() {
		var text = this.refs.data.getDOMNode().value;
		this.getRefluxAction('updateData')(JSON.parse(text));
	},
	render: function() {
		return (
			<div style={{height: 750}}>
				<div style={{width: '48%', float: 'right'}}>
					<Renderer data={this.state.data} components={this.state.components} />
				</div>
				<div style={{width: '48%', height: '100%', float: 'left'}}>
					<textarea defaultValue={JSON.stringify(this.state.components, null, '\t')} style={{width: '100%', height: '50%'}} onChange={this.onComponentsChange} ref="components" />
					<textarea defaultValue={JSON.stringify(this.state.data, null, '\t')} style={{width: '100%', height: '50%'}} onChange={this.onDataChange} ref="data" />
				</div>
				<div style={{clear: 'both'}} />
			</div>
		)
	},
});

module.exports = RendererBox;
