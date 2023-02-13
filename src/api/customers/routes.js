const routes = (handler) => [
  {
    method: 'POST',
    path: '/customers',
    handler: handler.postCustomerHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/customers',
    handler: handler.getCustomersHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/customers/{customerId}',
    handler: handler.getCustomerByIdHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'PUT',
    path: '/customers/{customerId}',
    handler: handler.putCustomerByIdHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/customers/{customerId}',
    handler: handler.deleteCustomerByIdHandler,
    options: {
      auth: 'iapp_jwt'
    }
  }
]

module.exports = routes
