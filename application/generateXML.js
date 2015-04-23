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

function generateValue(result, value, prefix, elements, componentName) {
	if (value === undefined || value === null) {
		result[prefix] = prefix;
		return result;
	}
	var type = typeof value;
	if (type === "object") {
		result[prefix][prefix + "Element"] = generateElement(value, elements, componentName);
	}
	else {
		result[prefix][prefix + "Value"] = value;
		if (type !== "string") {
			// number or boolean
			result[prefix][prefix + "Type"] = type;
		}
	}
	return result;
}

function generateChildren(children, elements, componentName) {
	if (!Array.isArray(children)) {
		children = children === undefined || children === null ? [] : [children];
	}
	var result = children.map(function (child, index) {
		var result = { child: { childIndex: index + 1 } };
		return generateValue(result, child, "child", elements, componentName);
	}).filter(function (result) {
		return result && result.child;
	});
	formatIndices(result, "child");
	return result;
}

function generateProperties(definition, omit, elements, componentName) {
	return Lazy(definition).omit(omit).map(function (value, name) {
		var result = { property: { propertyName: name } };
		return generateValue(result, value, "property", elements, componentName);
	}).filter(function (result) {
		return result && result.property;
	}).toArray();
}

function generateRenderable(element, definition, elements, componentName) {
	element.root = definition.root;
	element.properties = generateProperties(definition, ["root", "children"], elements, componentName);
	element.children = generateChildren(definition.children, elements, componentName);
	return element;
}

var syntaxProperties = {
	"$val": ["val"],
	"$index": ["index", "in"],
	"$for": ["for", "in", "do"],
	"$if": ["if", "then", "else"],
	"$merge": ["merge"]
};

function generateSyntax(element, definition, elements, componentName) {
	if (syntaxProperties[definition.root] === undefined) {
		throw new Error("Unknown syntax " + definition.root);
	}
	element.root = definition.root;
	syntaxProperties[definition.root].forEach(function (prop) {
		var result = {};
		result[prop] = {};
		result = generateValue(result, definition[prop], prop, elements, componentName);
		element[prop] = result[prop];
	});
	return element;
}

function generateObject(element, definition, elements, componentName) {
	element.properties = generateProperties(definition, [], elements, componentName);
	return element;
}

function generateArray(element, definition, elements, componentName) {
	element.children = generateChildren(definition, elements, componentName);
	return element;
}

function generateElement(definition, elements, componentName, componentRoot) {
	var type = getType(definition);
	var element = { elementIndex: undefined, elementType: type };
	if (componentName) {
		element.componentName = componentName;
	}
	else {
		element.componentRender = "1";
	}
	if (componentRoot) {
		element.componentRoot = "1";
	}
	switch (type) {
		case "tag":
		case "component":
			element = generateRenderable(element, definition, elements, componentName);
			break;
		case "syntax":
			element = generateSyntax(element, definition, elements, componentName);
			break;
		case "object":
			element = generateObject(element, definition, elements, componentName);
			break;
		case "array":
			element = generateArray(element, definition, elements, componentName);
			break;
		default:
			throw new Error("Unknown element type " + type);
	}
	return element.elementIndex = elements.push({ element: element });
}

function addSlashes(elements) {
	Object.keys(elements).forEach(function (key) {
		if (elements[key] !== null && typeof elements[key] === "object") {
			addSlashes(elements[key]);
		}
		else if (typeof elements[key] === "string") {
			elements[key] = elements[key].replace(/"/g, "\\\"");
		}
	});
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

function formatElementReferences(elements, length) {
	Object.keys(elements).forEach(function (key) {
		if (elements[key] !== null && typeof elements[key] === "object") {
			formatElementReferences(elements[key], length);
		}
		else if (key.length >= 7 && key.indexOf("Element", key.length - 7) === key.length - 7) {
			var referenceLength = elements[key].toString().length;
			for (var i = referenceLength; i < length; i++) {
				elements[key] = "0" + elements[key];
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
		componentRender: "_",
		componentRoot: "_",
		root: "_",
		children: [ { child: { childIndex: "_" } } ],
		properties: [ { property: { propertyName: "_" } } ]
	};
	Lazy({ children: "child", properties: "property" }).each(function (prefix, field) {
		element[field][0][prefix][prefix + "Element"] = "_";
		element[field][0][prefix][prefix + "Value"] = "_";
		element[field][0][prefix][prefix + "Type"] = "_";
	});
	Lazy(syntaxProperties).values().flatten().each(function (prefix) {
		element[prefix] = element[prefix] || {};
		element[prefix][prefix + "Element"] = "_";
		element[prefix][prefix + "Value"] = "_";
		element[prefix][prefix + "Type"] = "_";
	});
	return elements.push({ element: element });
}

function finalize(elements) {
	addSlashes(elements);
	formatIndices(elements, "element");
	formatElementReferences(elements, elements.length.toString().length);
	generatePlaceholder(elements);
}

function generateXML(definition) {
	var elements = [];
	generateElement(definition, elements, null, true);
	finalize(elements);
	return XMLBuilder.create({ elements: elements }).toString();
}

function generateXMLComponents(data) {
	var elements = [];
	Lazy(data).each(function (definition, componentName) {
		generateElement(definition, elements, componentName, true);
	});
	finalize(elements);
	return XMLBuilder.create({ elements: elements }).toString();
}

module.exports = {
	generateXML: generateXML,
	generateXMLComponents: generateXMLComponents
};
