const autoBind = require('auto-bind')

class CustomersHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postCustomerHandler(request, h) {
    this._validator.validateCustomerPayload(request.payload)
    const { customerName, address, phoneNumber } = request.payload

    const customer = await this._service.addCustomer({
      customerName,
      address,
      phoneNumber
    })

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan data pembeli',
      data: {
        customer
      }
    })
    response.code(201)
    return response
  }

  async getCustomersHandler() {
    const customers = await this._service.getCustomers()

    return {
      status: 'success',
      data: {
        customers
      }
    }
  }

  async getCustomerByIdHandler(request) {
    const { customerId } = request.params
    const customer = await this._service.getCustomerById(customerId)

    return {
      status: 'success',
      data: {
        customer
      }
    }
  }

  async putCustomerByIdHandler(request) {
    const { customerId } = request.params
    const { customerName, address, phoneNumber } = request.payload

    await this._service.updateCustomerById(customerId, {
      customerName,
      address,
      phoneNumber
    })

    return {
      status: 'success',
      message: 'Berhasil mengubah data pembeli'
    }
  }

  async deleteCustomerByIdHandler(request) {
    const { customerId } = request.params

    await this._service.deleteCustomerById(customerId)

    return {
      status: 'success',
      message: 'Berhasil menghapus data pembeli'
    }
  }
}

module.exports = CustomersHandler
