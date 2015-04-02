module.exports = {
	NAME: "Instinct UI",
	SHORT_NAME: "instinct-ui",
	FAV_ICON_URL: "/static/images/favicon.ico",
	TITLE_SEPARATOR: " – ",
	FILESYSTEM_PATHS: {
		BASE: __dirname,
		ROUTES: "./routes.jsx",
		REFLUX_DEFINITIONS: "./reflux/definitions.js",
		REFLUX_ACTIONS_FOR_ROUTER_STATE: "./reflux/actionsForRouterState.js",
		STYLES: "./styles.scss",
		BUNDLES: "../bundles/"
	},
	CUSTOM_SETTINGS: {
		STATIC_URL: "/static"
	}
};
