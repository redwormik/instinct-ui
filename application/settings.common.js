module.exports = {
	"NAME": "MI-DIP",
	"SHORT_NAME": "mi-dip",
	"FAV_ICON_URL": "/static/images/logo.svg",
	"TITLE_SEPARATOR": " - ",
	"FILESYSTEM_PATHS": {
		"BASE": __dirname,
		"ROUTES": "./routes.jsx",
		"REFLUX_DEFINITIONS": "./reflux/definitions.js",
		"REFLUX_ACTIONS_FOR_ROUTER_STATE": "./reflux/actionsForRouterState.js",
		"STYLES": "./styles.scss",
		"BUNDLES": "../bundles/"
	},
	"CUSTOM_SETTINGS": {
		"API_BASE_URL": "http://127.0.0.1:8080/api/"
	}
};
