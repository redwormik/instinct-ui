var React = require("react");
var Lazy = require("lazy.js");

var ErrorMessage = require("./ErrorMessage.jsx");


var Renderer = React.createClass({
	getInitialState: function () {
		return {
			components: Lazy(this.props.components).map(function (definition, key) {
				return [key, this.createComponent(definition, key)];
			}.bind(this)).toObject()
		};
	},
	componentWillReceiveProps: function (newProps) {
		this.setState({
			components: Lazy(newProps.components).map(function (definition, key) {
				return [key, this.createComponent(definition, key)];
			}.bind(this)).toObject()
		});
	},
	$val: function (definition, values) {
		var val = this.replaceSyntax(definition.val, values);
		return values[val];
	},
	$index: function (definition, values) {
		var index = this.replaceSyntax(definition.index, values);
		var inVal = this.replaceSyntax(definition.in, values);
		return (inVal === null || inVal === undefined) ? undefined : inVal[index];
	},
	$for: function (definition, values) {
		var forVal = this.replaceSyntax(definition.for, values);
		var inVal = this.replaceSyntax(definition.in, values);
		if (inVal === null || typeof inVal !== "object") {
			return null;
		}
		var isArray = Array.isArray(inVal);
		var map = Lazy(inVal).map(function (value, key) {
			var tmp = {};
			tmp[forVal] = key;
			var newValues = Lazy(values).assign(tmp).toObject();
			var doVal = this.replaceSyntax(definition.do, newValues);
			return isArray ? doVal : [key, doVal];
		}.bind(this));
		return isArray ? map.toArray() : map.toObject();
	},
	$if: function (definition, values) {
		var ifVal = this.replaceSyntax(definition.if, values);
		return ifVal ?
			this.replaceSyntax(definition.then, values) :
			this.replaceSyntax(definition.else, values);
	},
	$merge: function (definition, values) {
		var merge = Lazy(this.replaceSyntax(definition.merge, values));
		var withVal = this.replaceSyntax(definition.with, values);
		if (!withVal) {
			return merge.toObject();
		}
		if (Array.isArray(withVal)) {
			return merge.merge.apply(merge, withVal).toObject();
		}
		return merge.merge(withVal).toObject();
	},
	replaceSyntax: function (definition, values) {
		if (definition === null || typeof definition !== "object") {
			return definition;
		}

		if (Array.isArray(definition)) {
			return definition.map(function (def) {
				return this.replaceSyntax(def, values);
			}.bind(this));
		}

		var type = definition.$type;
		if (!type || !/^\$/.exec(type)) {
			return Lazy(definition).map(function (def, key) {
				return [key, this.replaceSyntax(def, values)];
			}.bind(this)).toObject();
		}
		if (!this[type]) {
			throw new Error("Unknown syntax \"" + type + "\"");
		}
		return this[type](definition, values);
	},
	getType: function (definition) {
		if (definition === null || typeof definition !== "object") {
			throw new Error("Root element must be object")
		}

		if (Array.isArray(definition)) {
			throw new Error("Element cannot be an array");
		}

		var type = definition.$type;

		if (type === undefined) {
			throw new Error("Missing $type attribute");
		}

		if (!type || /^\$/.exec(type)) {
			throw new Error("Invalid $type \"" + type + "\"");
		}

		if (/^[A-Z]/.exec(type)) {
			if (!this.state.components[type]) {
				throw new Error("Unknown component \"" + type + "\"");
			}
			type = this.state.components[type];
		}
		return type;
	},
	createElement: function (definition, isRoot, values, index) {
		try {
			if (isRoot) {
				definition = this.replaceSyntax(definition, values);
			}
			else if (definition === null || typeof definition !== "object") {
				return (definition === null || definition === undefined) ? '' : definition.toString();
			}
			if (definition && definition._isReactElement) {
				return definition;
			}
			var type = this.getType(definition);
		} catch (ex) {
			return <ErrorMessage message={ ex.message } key={ index } />;
		}

		var props = Lazy(definition)
			.omit(["$type", "children"])
			.defaults({ key: index })
			.toObject();

		var children = definition.children ?
			Lazy([definition.children])
				.flatten()
				.map(function (child, i) {
					var childIndex = (index ? index + "-" : "") + i;
					return this.createElement(child, false, values, childIndex);
				}.bind(this))
				.filter(Lazy.identity)
				.toArray() :
			[];

		return children.length > 0 ?
			React.createElement(type, props, children.length === 1 ? children[0] : children) :
			React.createElement(type, props);
	},
	createComponent: function (definition, name) {
		var self = this;
		return React.createClass({
			displayName: name,
			render: function () {
				return self.createElement(definition, true, this.props, undefined);
			}
		});
	},
	render: function () {
		return this.createElement(this.props.data, true, {}, undefined);
	}
});

module.exports = Renderer;
