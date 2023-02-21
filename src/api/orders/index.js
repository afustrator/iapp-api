const OrdersHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'orders',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const ordersHandler = new OrdersHandler(service, validator)

    server.route(routes(ordersHandler))
  }
}
