const routes = (handler) => [
  {
    method: 'POST',
    path: '/product',
    handler: handler.postProductHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/product',
    handler: handler.getProductsHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/product/{productId}',
    handler: handler.getProductByIdHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'PUT',
    path: '/product/{productId}',
    handler: handler.putProductByIdHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/product/{productId}',
    handler: handler.deleteProductByIdHandler,
    options: {
      auth: 'iapp_jwt'
    }
  }
]

module.exports = routes
