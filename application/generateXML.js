var XMLBuilder = require("xmlbuilder");
var Lazy = require("lazy.js");


function getType(definition) {
	if (definition === null || typeof definition !== "object") {
		throw new Error("Not an object: " + definition);
	}
	if (Array.isArray(definition)) {
		return "array";
	}
	if (!definition.root) {
		return "object";
	}
	if (/^\$/.exec(definition.root)) {
		return "syntax";
	}
	if (/^[A-Z]/.exec(definition.root)) {
		return "component";
	}
	return "tag";
}

function generateValue(result, value, prefix, elements) {
	if (value === undefined || value === null) {
		result[prefix] = null;
		return result;
	}
	var type = typeof value;
	if (type === "object") {
		result[prefix][prefix + "Element"] = generateElement(value, elements);
	}
	else if (type === "string") {
		result[prefix][prefix + "Value"] = value;
	}
	else {
		// number or boolean
		result[prefix][prefix + "Value"] = Number(value);
		result[prefix][prefix + "Type"] = type;
	}
	return result;
}

function generateChildren(children, elements) {
	if (!Array.isArray(children)) {
		children = [children];
	}
	var result = children.map(function (child, index) {
		var result = { child: { childIndex: index + 1 } };
		return generateValue(result, child, "child", elements);
	}).filter(function (result) {
		return result && result.child;
	});
	formatIndices(result, "child");
	return result;
}

function generateProperties(definition, omit, elements) {
	return Lazy(definition).omit(omit).map(function (value, name) {
		var result = { property: { propertyName: name } };
		return generateValue(result, value, "property", elements);
	}).filter(function (result) {
		return result && result.property;
	}).toArray();
}

function generateRenderable(element, definition, elements) {
	element.root = definition.root;
	element.properties = generateProperties(definition, ["root", "children"], elements);
	element.children = generateChildren(definition.children, elements);
	return element;
}

var syntaxProperties = {
	"$val": ["val"],
	"$index": ["index", "in"],
	"$for": ["for", "in", "do"],
	"$if": ["if", "then", "else"],
	"$merge": ["merge", "with"]
};

function generateSyntax(element, definition, elements) {
	if (syntaxProperties[definition.root] === undefined) {
		throw new Error("Unknown syntax " + definition.root);
	}
	element.root = definition.root;
	syntaxProperties[definition.root].forEach(function (prop) {
		var result = {};
		result[prop] = {};
		result = generateValue(result, definition[prop], prop, elements);
		if (result[prop]) {
			element[prop] = result[prop];
		}
	});
	return element;
}

function generateObject(element, definition, elements) {
	element.properties = generateProperties(definition, [], elements);
	return element;
}

function generateArray(element, definition, elements) {
	element.children = generateChildren(definition, elements);
	return element;
}

function generateElement(definition, elements, name) {
	var type = getType(definition);
	var element = { elementIndex: undefined, elementType: type };
	if (name) {
		element.componentName = name;
	}
	switch (type) {
		case "tag":
		case "component":
			element = generateRenderable(element, definition, elements);
			break;
		case "syntax":
			element = generateSyntax(element, definition, elements);
			break;
		case "object":
			element = generateObject(element, definition, elements);
			break;
		case "array":
			element = generateArray(element, definition, elements);
			break;
		default:
			throw new Error("Unknown element type " + type);
	}
	return element.elementIndex = elements.push({ element: element });
}

function formatIndices(elements, prefix) {
	var length = elements.length.toString().length;
	elements.forEach(function (el) {
		if (el[prefix][prefix + "Index"]) {
			var indexLength = el[prefix][prefix + "Index"].toString().length;
			for (var i = indexLength; i < length; i++) {
				el[prefix][prefix + "Index"] = "0" + el[prefix][prefix + "Index"];
			}
		}
	});
}

function generatePlaceholder(elements) {
	var element = {
		// omitting elementIndex so it will not affect GES
		// (no other way than defining fields)
		elementType: "placeholder",
		componentName: "_",
		root: "_",
		child: { childIndex: "_" },
		property: { propertyName: "_" }
	};
	var syntaxProps = Lazy(syntaxProperties).values().flatten();
	Lazy(["child", "property"]).concat(syntaxProps).each(function (prefix) {
		element[prefix] = element[prefix] || {};
		element[prefix][prefix + "Element"] = "_";
		element[prefix][prefix + "Value"] = "_";
		element[prefix][prefix + "Type"] = "_";
	});
	return elements.push({ element: element });
}

function generateXML(definition) {
	var elements = [];
	generateElement(definition, elements);
	formatIndices(elements, "element");
	generatePlaceholder(elements);
	return XMLBuilder.create({ elements: elements }).toString();
}

function generateXMLComponents(data) {
	var elements = [];
	Lazy(data).each(function (definition, name) {
		generateElement(definition, elements, name);
	});
	formatIndices(elements, "element");
	generatePlaceholder(elements);
	return XMLBuilder.create({ elements: elements }).toString();
}

module.exports = {
	generateXML: generateXML,
	generateXMLComponents: generateXMLComponents
};
