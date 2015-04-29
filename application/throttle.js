var when = require("when");
// https://remysharp.com/2010/07/21/throttling-function-calls
// http://benalman.com/projects/jquery-throttle-debounce-plugin/


function throttle(threshold, trailing) {
	var timer = null, deferred = null, last = null;

	return function () {
		var that = this;
		var args = arguments;
		var now = +(new Date());

		if (timer) {
			clearTimeout(timer);
			deferred.reject();
			timer = null;
		}
		if (last && (now - last < threshold)) {
			if (trailing) {
				deferred = when.defer();
				timer = setTimeout(function () {
					last = +(new Date());
					deferred.resolve();
				}, threshold - (now - last));
				return deferred.promise;
			}
			else {
				return when.reject();
			}
		}
		else {
			last = now;
			return when.resolve();
		}
	}
}

module.exports = throttle;
