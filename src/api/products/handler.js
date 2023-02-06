const autoBind = require('auto-bind')

class ProductsHandler {
  constructor(service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postProductHandler(request, h) {
    this._validator.validatePostProductPayload(request.payload)
    const {
      productName,
      brand,
      stock,
      capitalPrice,
      sellingPrice,
      discount,
      categoryId,
      expireDate
    } = request.payload

    const product = await this._service.addProduct({
      productName,
      brand,
      stock,
      capitalPrice,
      sellingPrice,
      discount,
      categoryId,
      expireDate
    })

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan produk',
      data: {
        product
      }
    })
    response.code(201)
    return response
  }

  async getProductsHandler(request) {
    const { product_name: productName } = request.query
    const products = await this._service.getProducts({ productName })

    return {
      status: 'success',
      data: {
        products
      }
    }
  }

  async getProductByIdHandler(request) {
    const { productId } = request.params
    const product = await this._service.getProductById(productId)

    return {
      status: 'success',
      data: {
        product
      }
    }
  }

  async putProductByIdHandler(request) {
    this._validator.validatePutProductPayload(request.payload)
    const { productId } = request.params
    const { productName, brand, stock, capitalPrice, sellingPrice, discount } =
      request.payload

    await this._service.updateProductById(productId, {
      productName,
      brand,
      stock,
      capitalPrice,
      sellingPrice,
      discount
    })

    return {
      status: 'success',
      message: 'Berhasil memperbarui produk'
    }
  }

  async deleteProductByIdHandler(request) {
    const { productId } = request.params

    await this._service.deleteProductById(productId)
    return {
      status: 'success',
      message: 'Berhasil menghapus produk'
    }
  }
}

module.exports = ProductsHandler
