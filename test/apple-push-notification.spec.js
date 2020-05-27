const assert = require('assert')
const ApnProvider = require('../lib/index.js')

describe('Apple Push Notication', function () {
	it('should at least build an instance', async function () {
		const config = {
			privatekey: null,
			certificate: null
		}

		const apn = new ApnProvider(config)
		/* await apn.connect() */
		assert.deepStrictEqual(apn.privatekey, null)
		assert.deepStrictEqual(apn.certificate, null)
		// apn.close()
	})
})