var React = require("react");
var Lazy = require("lazy.js");
var assign = Object.assign || require("react/lib/Object.assign.js");

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
		if (newProps.components === this.props.components) {
			return;
		}
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
		return (inVal === null || typeof inVal !== "object") ? undefined : inVal[index];
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
		var merge = this.replaceSyntax(definition.merge, values);
		if (!Array.isArray(merge)) {
			return merge;
		}
		var result = Lazy({});
		return result.merge.apply(result, merge).toObject();
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

		var type = definition.root;
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

		var type = definition.root;

		if (type === undefined) {
			throw new Error("Missing root attribute");
		}

		// TODO: check type value
		if (!type || type === null || typeof type === "object" || !/^[A-Za-z]/.exec(type)) {
			var typeString = (typeof type === "string" ?  "\"" + type + "\"" : type);
			throw new Error("Invalid root " + typeString);
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
		var type;
		try {
			if (isRoot) {
				definition = this.replaceSyntax(definition, values);
			}
			else if (definition === null || typeof definition !== "object") {
				return definition;
			}
			if (React.isValidElement(definition)) {
				throw new Error("Element already created!");
			}
			type = this.getType(definition);
		} catch (ex) {
			return <ErrorMessage message={ ex.message } key={ index } />;
		}

		var props = Lazy(definition)
			.omit(["root", "children"])
			.defaults({ key: index })
			.toObject();

		var isComponent = typeof type === "function"

		var children = definition.children;
		children = Lazy([children]).flatten();
		if (!isComponent) {
			children = children.map(function (child, i) {
				return this.createElement(child, false, values, i);
			}.bind(this))
		}
		children = children.filter(function (child) {
			return child !== null && child !== undefined && child !== "";
		}).toArray();

		var empty = children.length === 0;
		var onlyChild = !isComponent && children.length === 1;

		return empty ? React.createElement(type, props) :
			React.createElement(type, props, onlyChild ? children[0] : children);
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
		if (!this.props.root) {
			return (
				<div style={ this.props.style }>
					<ErrorMessage message="No component selected" />
				</div>
			);
		}
		var root = this.props.root;
		if (!/^[A-Z]/.exec(root)) {
			var rootString = (typeof root === "string" ?  "\"" + root + "\"" : root);
			return (
				<div style={ this.props.style }>
					<ErrorMessage message={ "Invalid root " + rootString } />
				</div>
			);
		}
		var definition = assign({}, this.props.data, {root: root});
		return (
			<div style={ this.props.style }>
				{ this.createElement(definition, true, {}, undefined) }
			</div>
		);
	}
});

module.exports = Renderer;
