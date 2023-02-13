const Joi = require('joi')

const CustomerPayloadSchema = Joi.object({
  customerName: Joi.string().required(),
  address: Joi.string().required(),
  phoneNumber: Joi.number().integer().required()
})

module.exports = CustomerPayloadSchema
