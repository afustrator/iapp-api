const Joi = require('joi')

const PostProductPayloadSchema = Joi.object({
  productName: Joi.string().required(),
  stock: Joi.number().integer().required(),
  capitalPrice: Joi.number().integer().required(),
  sellingPrice: Joi.number().integer().required(),
  categoryId: Joi.string(),
  expireDate: Joi.number().integer().required()
})

const PutProductPayloadSchema = Joi.object({
  productName: Joi.string().required(),
  stock: Joi.number().integer().required(),
  capitalPrice: Joi.number().integer().required(),
  sellingPrice: Joi.number().integer().required()
})

module.exports = { PostProductPayloadSchema, PutProductPayloadSchema }
