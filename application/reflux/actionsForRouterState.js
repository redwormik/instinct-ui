var utilities = require("ambidex").addons.utilities;


module.exports = [
	{
		actionName: "getComponents",
		storeName: "Components"
	},
	{
		actionName: "getData",
		storeName: "Data"
	},
	{
		parameterName: "component",
		actionName: "getCurrentComponent",
		storeName: "CurrentComponent",
		isReady: utilities.hasContent
	}
];
