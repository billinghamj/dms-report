# dms-report

Simple library for reporting to [Dead Man's Snitch](https://deadmanssnitch.com).

Returns promises only. Standard callbacks are not supported. Though optionally you can just "fire and forget" and discard the returned promise - in this case, delivery isn't guaranteed, but is still likely.

You can either report manually, or wrap an existing promise-returning function.

If using `wrapBlocking`, please be aware that the result of the reporting process is not exposed. The process will block for a maximum of 5 seconds.

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
async foo(someId) {
	return await doSomething(someId);
}

// if doing e.g. `obj.foo`, you may need to do `obj.foo.bind(obj)`
const wrapped = dms.wrap('76d84d19e4', foo);

const result = await wrapped('some-input');

// for environments which must block during the reporting process
const wrapped = dms.wrapBlocking('76d84d19e4', foo);
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
