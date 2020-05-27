# @sa/simple-apn

Simple way to send Apple Push Notifications


## Example
```

require('dotenv').config({ path: path.join(__dirname, './../.env') })

async function push() {
	const apn = new SimpleApn({
		privatekey: ...,
		certificate: ...
	})
	const pushToken = ...
	// eslint-disable-next-line no-console
	console.log(pushToken, ' start')
    const response = await apn.push(pushToken)
    // eslint-disable-next-line no-console
    console.log(response)
	apn.close()
	// eslint-disable-next-line no-console
	console.log(pushToken, ' done')
}

push()

```

yields:

```
***  start
[Object: null prototype] {
  ':status': 200,
  'apns-id': '********-****-****-****-************'
}
***  done
```