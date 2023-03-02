const routes = (handler) => [
  {
    method: 'POST',
    path: '/products',
    handler: handler.postProductHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/products',
    handler: handler.getProductsHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/products/{productId}',
    handler: handler.getProductByIdHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'PUT',
    path: '/products/{productId}',
    handler: handler.putProductByIdHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/products/{productId}',
    handler: handler.deleteProductByIdHandler,
    options: {
      auth: 'iapp_jwt'
    }
  }
]

module.exports = routes
