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
      message: 'Transaksi berhasil',
      data: {
        orderId
      }
    })
    response.code(201)
    return response
  }
}

module.exports = OrdersHandler
