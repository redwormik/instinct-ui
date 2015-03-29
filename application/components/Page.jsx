var React = require("react");
var Link = require("react-router").Link;


var Page = React.createClass({
	render: function () {
		var numbers = [1,2,3,4];
		numbers = numbers.map(function(i, index) {
			return [(<span>{i}</span>),(<span>{index}</span>)];
		});
		console.log(numbers);
		return (
			<div className="Page">
				This is the super awesome Page!
				<Link to="/">Linkage</Link>
				{numbers}
			</div>
		);
	}
});

module.exports = Page;
