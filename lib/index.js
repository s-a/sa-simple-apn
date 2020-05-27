const http2 = require('http2')
const { HTTP2_HEADER_METHOD, HTTP2_HEADER_PATH, NGHTTP2_CANCEL, HTTP2_METHOD_POST } = http2.constants
const path = require('path')
const fs = require('fs').promises
function SimpleApn(config) {
	this.privatekey = config.privatekey
	this.certificate = config.certificate
	return this
}

SimpleApn.prototype.connect = async function () {
	const self = this
	return new Promise((resolve, reject) => {
		if (!self.privatekey) {
			throw new ReferenceError(`Set private key before trying to push pass updates`)
		}

		if (!self.certificate) {
			throw new ReferenceError(`Set pass certificate before trying to push pass updates`)
		}

		this.http2 = http2.connect('https://api.push.apple.com:443', {
			key: this.key,
			cert: this.certificate
		})

		this.http2
			.once('goaway', () => {
				if (this.http2 && !this.http2.destroyed) {
					this.http2.destroy()
				}
			})
			.once('error', (e) => {
				reject(e)
			})
			.once('frameError', (e) => {
				reject(e)
			})
			.once('timeout', (e) => {
				reject(e)
			})
			.once('connect', () => {
				if (this.http2.destroyed) {
					throw new Error('HTTP2 was destroyed before connecting')
				}
				resolve()
			})
	})
}

SimpleApn.prototype.submit = function (pushToken, payload) {
	return new Promise((resolve, reject) => {
		if (!this.http2 || this.http2.destroyed) {
			throw new Error('http2 not connected')
		}
		const req = this.http2.request({
			[HTTP2_HEADER_METHOD]: HTTP2_METHOD_POST,
			[HTTP2_HEADER_PATH]: `/3/device/${encodeURIComponent(pushToken)}`
		})
		req.setTimeout(5000, () => {
			req.close(NGHTTP2_CANCEL, () => reject(new Error(`http2: timeout connecting to api.push.apple.com`)))
		})
		req.once('error', reject)
		req.once('response', resolve)
		req.end(JSON.stringify(payload || {}))
	})
}

SimpleApn.prototype.push = async function (pushToken) {
	// https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/PassKit_PG/Updating.html
	if (!this.http2 || this.http2.destroyed) {
		await this.connect()
	}
	const res = await this.submit(pushToken)
	return res
}

SimpleApn.prototype.close = function () {
	this.http2.close()
}

module.exports = SimpleApn
