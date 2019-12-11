const fetch = require('fetch-everywhere');

exports.report = report;
exports.wrap = wrap.bind(null, false);
exports.wrapBlocking = wrap.bind(null, true);

function report(token, params = {}) {
	const body = Object.keys(params)
		.map(function (key) {
			return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
		})
		.join('&');

	return fetch('https://nosnch.in/' + token, {
		method: 'post',
		headers: {
			'content-type': 'application/x-www-form-urlencoded',
		},
		body: body,
	});
}

function wrap(token, func, blocking) {
	return function () {
		return func.apply(null, arguments).then(
			function (result) {
				return silentReport(blocking, token, void 0, function () {
					return result;
				});
			},
			function (error) {
				const params = {
					s: 1,
					m: error.message,
				};

				return silentReport(blocking, token, params, function () {
					throw error;
				});
			}
		);
	};
}

function silentReport(blocking, token, params, func) {
	// give up after 5 seconds
	const promise = Promise.race([
		report(token, params),
		new Promise(function (r) { setTimeout(r, 5000); }),
	]);

	if (!blocking)
		return func();

	// don't propagate reporting errors
	return promise.then(func, func);
}
