const fetch = require('fetch-everywhere');

exports.report = report;
exports.wrap = wrap;
exports.wrapBlocking = wrapBlocking;

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

function wrapBlocking(token, func) {
	return async () => {
		try {
			const result = await func.apply(null, arguments);
			await tryReport(token);
			return result;
		} catch (error) {
			await tryReport(token, {s: 1, m: error.message});
			throw error;
		}
	};
}

async function tryReport(token, params = {}) {
	try {
		await report(token, params);
	} catch {} // Ignoring failed reports
}
