const autoBind = require('auto-bind')

class OrdersHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postOrderHandler(request, h) {
    this._validator.validateOrderPayload(request.payload)

    const { id: userId } = request.auth.credentials
    const { name, address, phone, items } = request.payload

    const orderId = await this._service.addOrder({
      userId,
      name,
      address,
      phone,
      items
    })

    const response = h.response({
      status: 'success',
      message: 'Transaksi berhasil ditambahkan',
      data: {
        orderId
      }
    })
    response.code(201)
    return response
  }

  async getOrdersHandler(request) {
    const { id: userId } = request.auth.credentials
    const { page } = request.query

    const { orders, meta } = await this._service.getOrders(userId, { page })

    return {
      status: 'success',
      data: {
        orders,
        meta
      }
    }
  }

  async getOrderByIdHandler(request) {
    const { orderId } = request.params

    const order = await this._service.getOrderById(orderId)

    return {
      status: 'success',
      data: {
        order
      }
    }
  }
}

module.exports = OrdersHandler
