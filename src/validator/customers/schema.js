const Joi = require('joi')

const CustomerPayloadSchema = Joi.object({
  customerName: Joi.string().required(),
  address: Joi.string().required(),
  phoneNumber: Joi.number().integer().min(9).max(13).required()
})

module.exports = CustomerPayloadSchema
