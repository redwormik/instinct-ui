// https://remysharp.com/2010/07/21/throttling-function-calls
// http://benalman.com/projects/jquery-throttle-debounce-plugin/


function throttle(fn, threshold) {
	var timer, last;

	return function() {
		var that = this;
		var args = arguments;
		var now = +(new Date());

		if (timer) clearTimeout(timer);

		if (last && (now - last < threshold)) {
			timer = setTimeout(function() {
				last = +(new Date());
				fn.apply(that, args);
			}, threshold - (now - last));
		}
		else {
			last = now;
			fn.apply(that, args);
		}
	}
}

module.exports = throttle;
