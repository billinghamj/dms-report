const fetch = require('fetch-everywhere');

exports.report = report;
exports.wrap = wrap;

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

function wrap(token, func) {
	return function () {
		return func.apply(null, arguments).then(
			function (result) {
				report(token);

				return result;
			},
			function (error) {
				report(token, {
					s: 1,
					m: error.message,
				});

				throw error;
			},
		);
	};
}
