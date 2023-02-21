const Joi = require('joi')

const OrderPayloadSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.number().integer().required(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().integer().required()
      })
    )
    .required()
})

module.exports = { OrderPayloadSchema }
