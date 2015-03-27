var React = require("react");
var Link = require("react-router").Link;


var Page = React.createClass({
	render: function () {
		return (
			<div className="Page">
				This is the super awesome Page!
				<Link to="/">Linkage</Link>
			</div>
		);
	}
});

module.exports = Page;
