var React = require("react");
var Renderer = require("./Renderer.jsx");

var components = {
	Table: {
		root: 'table',
		style: {border: '3px solid black'},
		children: [
			{root: 'caption', children: '{caption}'},
			{for: '{data}', index: 'index', value: 'value', do:
				{root: 'TableRow', data: '{value}'},
			}
		],
	},
	TableRow: {
		root: 'tr',
		style: {background: '#999'},
		children: {for: '{data}', index: 'index', value: 'value', do:
			{root: 'TableCell', children: '{value}'},
		},
	},
	TableCell: {
		root: 'td',
		style: {border: '1px solid black'},
		children: '{children}',
	},
	AnotherTable: {
		root: 'Table',
	},
	Box: {
		root: 'div',
		style: {
			border: '3px solid black',
			float: 'left',
			padding: 5,
			margin: 5,
			position: '{style.position}',
			top: '{style.top}',
			left: '{style.left}',
		},
		children: [
			{root: 'div', children: '{name}'},
			'{children}',
		]
	},
	Boxes: {
		root: 'div',
		children: [{
			root: 'Box',
			name: 'My Box',
			children: [{
				root: 'Box',
				name: 'My Inner Box',
				children: [{
					root: 'Box',
					name: 'My Inner Inner Box',
				}]
			},{
				root: 'Box',
				name: 'My Second Inner Box',
			}]
		},{
			root: 'div',
			style: {clear: 'both'},
		}]
	},
	Boxes2: {
		root: 'Box',
		name: 'NOT NAME',
		children: [{
			root: 'Box',
			name: '{name}',
		}]
	},
	Figure: {
		root: 'div',
		children: [
			'{title}',
			{root: 'br'},
			{
				root: 'img',
				src: '{src}',
				alt: '{title}',
				title: '{title}',
			}
		]
	},
	Container: {
		root: 'div',
		style: {width: '100%', height: 600, position: 'relative'},
		children: '{children}',
	}
}

var root = {
	root: 'div',
	children: [
		{root: 'h1', style: {color: 'blue'}, title: 'test', children: 'foo'},
		{root: 'Table', caption: 'This is a table', data: [
			['cell', 'second', 'last'],
			['not a cell', 'not second', 'last'],
			['not a cell', 'second', 'not last'],
		]},
		{root: 'div', children: 'test'},
		{root: 'br'},
		{root: 'a', href: "http://seznam.cz", target: "_blank", children: 'link'},
		{root: 'div', children: 'bar'},
		{root: 'table', children: [
			{root: 'tr', children: [
				{root: 'th', children: 'foo'},
				{root: 'th', children: 'bar'},
			]},
			{root: 'tr', children: [
				{root: 'td', children: 'bar'},
				{root: 'td', children: 'foo'},
			]},
		]},
		'foo',
		'bar',
		{root: 'AnotherTable'},
		{root: 'Boxes'},
		{root: 'Figure', src: 'file:///home/wormik/Obrázky/bear_184.png', title: 'DER INF'},
		{root: 'Container', children: [
			{root: 'Box', name: 'THIS IS A BOX', style: {position: 'absolute', top: 200, left: 300}}
		]},
	]
}

var RendererBox = React.createClass({
	getInitialState: function() {
		return {
			components: components,
			root: root,
		};
	},
	onComponentsChange: function() {
		var text = this.refs.components.getDOMNode().value;
		this.setState({components: JSON.parse(text)});
	},
	onRootChange: function() {
		var text = this.refs.root.getDOMNode().value;
		this.setState({root: JSON.parse(text)});
	},
	render: function() {
		return (
			<div style={{height: 750}}>
				<div style={{width: '48%', float: 'right'}}>
					<Renderer root={this.state.root} components={this.state.components} />
				</div>
				<div style={{width: '48%', height: '100%', float: 'left'}}>
					<textarea defaultValue={JSON.stringify(this.state.components, null, 4)} style={{width: '100%', height: '50%'}} onChange={this.onComponentsChange} ref="components" />
					<textarea defaultValue={JSON.stringify(this.state.root, null, 4)} style={{width: '100%', height: '50%'}} onChange={this.onRootChange} ref="root" />
				</div>
				<div style={{clear: 'both'}} />
			</div>
		)
	},
});

module.exports = RendererBox;
