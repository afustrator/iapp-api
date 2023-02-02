const InvariantError = require('../../exceptions/InvariantError')
const CustomerPayloadSchema = require('./schema')

const CustomersValidator = {
  validateCustomerPayload: (payload) => {
    const validationResult = CustomerPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = CustomersValidator
