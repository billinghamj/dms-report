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
	return async () => {
		try {
			const result = await func.apply(null, arguments)
			await tryReport(token)
			return result;
		} catch (error) {
			await tryReport(token, {s: 1, m: error.message})
			throw error;
		}
	};
}

async function tryReport(token, params) {
	try {
		if (params)
			await report(token, params);
		else
			await report(token);
	} catch {} // Ignoring failed reports
}