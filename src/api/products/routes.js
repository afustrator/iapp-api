const routes = (handler) => [
  {
    method: 'POST',
    path: '/product',
    handler: handler.postProductHandler
  },
  {
    method: 'GET',
    path: '/product',
    handler: handler.getProductsHandler
  },
  {
    method: 'GET',
    path: '/product/{productId}',
    handler: handler.getProductByIdHandler
  },
  {
    method: 'PUT',
    path: '/product/{productId}',
    handler: handler.putProductByIdHandler
  },
  {
    method: 'DELETE',
    path: '/product/{productId}',
    handler: handler.deleteProductByIdHandler
  }
]

module.exports = routes
