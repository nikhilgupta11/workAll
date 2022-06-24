const middleware = {}

middleware['checkout'] = require('../middleware/checkout.js')
middleware['checkout'] = middleware['checkout'].default || middleware['checkout']

middleware['is-authenticated'] = require('../middleware/is-authenticated.js')
middleware['is-authenticated'] = middleware['is-authenticated'].default || middleware['is-authenticated']

export default middleware
