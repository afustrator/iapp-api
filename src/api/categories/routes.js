const routes = (handler) => [
  {
    method: 'POST',
    path: '/category',
    handler: handler.postCategoryHandler
  },
  {
    method: 'GET',
    path: '/category',
    handler: handler.getCategoriesHandler
  },
  {
    method: 'GET',
    path: '/category/{categoryId}',
    handler: handler.getCategoryByIdHandler
  },
  {
    method: 'PUT',
    path: '/category/{categoryId}',
    handler: handler.putCategoryByIdHandler
  },
  {
    method: 'DELETE',
    path: '/category/{categoryId}',
    handler: handler.deleteCategoryByIdHandler
  }
]

module.exports = routes
