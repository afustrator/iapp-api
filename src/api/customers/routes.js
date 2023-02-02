const routes = (handler) => [
  {
    method: 'POST',
    path: '/customers',
    handler: handler.postCustomerHandler
  },
  {
    method: 'GET',
    path: '/customers',
    handler: handler.getCustomersHandler
  },
  {
    method: 'GET',
    path: '/customers/{customerId}',
    handler: handler.getCustomerByIdHandler
  },
  {
    method: 'PUT',
    path: '/customers/{customerId}',
    handler: handler.putCustomerByIdHandler
  },
  {
    method: 'DELETE',
    path: '/customers/{customerId}',
    handler: handler.deleteCustomerByIdHandler
  }
]

module.exports = routes
