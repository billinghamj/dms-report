# dms-report

Simple library for reporting to [Dead Man's Snitch](https://deadmanssnitch.com).

Returns promises only. Standard callbacks are not supported.

You can either report manually, or wrap an existing promise-returning function.

```js
const dms = require('dms-report');

// indicates success
await dms.report('76d84d19e4');

// success with a message
await dms.report('76d84d19e4', { m: '500 items processed' });

// if you have error notices enabled, indicates failure
await dms.report('76d84d19e4', { s: 1, m: 'foobar error occurred' });

// wrap an existing promise-returning function and report the outcome
// - promise resolved -> success with no message
// - promise rejected -> failure with `error.message` as the message
async function foo(someId) {
	return await doSomething(someId);
}

// if doing e.g. `obj.foo`, you may need to do `obj.foo.bind(obj)`
const wrapped = dms.wrap('76d84d19e4', foo);

const result = await wrapped('some-input');
```

## Installation

```bash
$ npm install dms-report
```

## Support

Please open an issue on this repository.

## Authors

- James Billingham <james@jamesbillingham.com>

## License

MIT licensed - see [LICENSE](LICENSE) file
