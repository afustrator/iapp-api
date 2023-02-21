const routes = (handler) => [
  {
    method: 'POST',
    path: '/orders',
    handler: handler.postOrderHandler,
    options: {
      auth: 'iapp_jwt'
    }
  }
]

module.exports = routes
