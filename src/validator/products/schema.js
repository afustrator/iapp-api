const Joi = require('joi')

const PostProductPayloadSchema = Joi.object({
  name: Joi.string().required(),
  stock: Joi.number().integer().min(1).required(),
  price: Joi.number().integer().required(),
  categoryId: Joi.string(),
  expireDate: Joi.number().integer().required()
})

const PutProductPayloadSchema = Joi.object({
  name: Joi.string().required(),
  stock: Joi.number().integer().required(),
  price: Joi.number().integer().required()
})

module.exports = { PostProductPayloadSchema, PutProductPayloadSchema }
