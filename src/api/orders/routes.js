const routes = (handler) => [
  {
    method: 'POST',
    path: '/orders',
    handler: handler.postOrderHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/orders',
    handler: handler.getOrdersHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/orders/{orderId}',
    handler: handler.getOrderByIdHandler,
    options: {
      auth: 'iapp_jwt'
    }
  }
]

module.exports = routes
