const routes = (handler) => [
  {
    method: 'POST',
    path: '/category',
    handler: handler.postCategoryHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/category',
    handler: handler.getCategoriesHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'GET',
    path: '/category/{categoryId}',
    handler: handler.getCategoryByIdHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'PUT',
    path: '/category/{categoryId}',
    handler: handler.putCategoryByIdHandler,
    options: {
      auth: 'iapp_jwt'
    }
  },
  {
    method: 'DELETE',
    path: '/category/{categoryId}',
    handler: handler.deleteCategoryByIdHandler,
    options: {
      auth: 'iapp_jwt'
    }
  }
]

module.exports = routes
