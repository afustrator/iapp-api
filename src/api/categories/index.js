const CategoriesHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'categories',
  version: '1.0.0',
  register: async (
    server,
    { categoriesService, productsService, validator }
  ) => {
    const categoriesHandler = new CategoriesHandler(
      categoriesService,
      productsService,
      validator
    )
    server.route(routes(categoriesHandler))
  }
}
