var React = require("react");

var Renderer = React.createClass({
	createComponent: function(components, name) {
		var renderer = this;
		var definition = this.props.components[name];
		return React.createClass({
			displayName: name,
			getProp: function(ref) {
				var parts = ref.split('.');
				var props = this.props;
				for (var part in parts) {
					if (props) {
						props = props[parts[part]];
					}
				}
				return props;
			},
			replacePropRefs: function(obj, scope) {
				var copy = Array.isArray(obj) ? [] : {};
				var match;
				for (var key in obj) {
					if (typeof obj[key] === 'object' && obj[key] !== null) {
						if (obj[key].for) {
							var children = obj[key].do;
							var forNode = this.replacePropRefs({for: obj[key].for, value: obj[key].value, index: obj[key].index});
							copy[key] = [];
							for (var index in forNode.for) {
								if (forNode.index) this.props[forNode.index] = index;
								if (forNode.value) this.props[forNode.value] = forNode.for[index];
								// TODO: scope
								copy[key][index] = this.replacePropRefs(children);
							}
						}
						else {
							copy[key] = this.replacePropRefs(obj[key]);
						}
					}
					else if (match = /^\{(.+)\}$/.exec(obj[key])) {
						copy[key] = this.getProp(match[1]);
					}
					else {
						copy[key] = obj[key];
					}
				}
				return copy;
			},
			render: function() {
				var withProps = this.replacePropRefs(definition);
				var res = renderer.createElement(components, withProps);
				return res;
			},
		});
	},
	createElement: function(components, def, index) {
		if (def && def.map) {
			return def.map(this.createElement.bind(this, components));
		}
		if (!def || typeof def !== 'object') {
			return def;
		}
		if (!def.root) {
			return null;
		}

		var isComponent = /^[A-Z]/.exec(def.root);
		var root = isComponent ? components[def.root] : def.root;
		if (root === undefined && isComponent) {
			return "UNKNOWN COMPONENT \"" + def.root + "\"";
		}

		var props = {};
		for (var key in def) {
			if (key !== 'root' && key !== 'children') {
				props[key] = def[key];
			}
		}
		props.key = index;

		var children = !isComponent && def.children ?
			this.createElement(components, def.children) :
			def.children;
		var res =  React.createElement(root, props, children);
		return res;
	},
	render: function () {
		var components = {};
		for (var key in this.props.components) {
			components[key] = this.createComponent(components, key);
		}
		return (
			<div>{this.createElement(components, this.props.root)}</div>
		);
	}
});

module.exports = Renderer;
