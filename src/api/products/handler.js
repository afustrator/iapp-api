const autoBind = require('auto-bind')

class ProductsHandler {
  constructor(productsService, validator) {
    this._productsService = productsService
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
    const { id: credentialId } = request.auth.credentials

    const productId = await this._productsService.addProduct({
      productName,
      brand,
      stock,
      capitalPrice,
      sellingPrice,
      discount,
      categoryId,
      expireDate,
      owner: credentialId
    })

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan produk',
      data: {
        productId
      }
    })
    response.code(201)
    return response
  }

  async getProductsHandler(request) {
    const { id: credentialId } = request.auth.credentials
    const { product_name: productName } = request.query

    const products = await this._productsService.getProducts(credentialId, {
      productName
    })

    return {
      status: 'success',
      data: {
        products
      }
    }
  }

  async getProductByIdHandler(request) {
    const { productId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._productsService.verifyProductOwner(productId, credentialId)
    const product = await this._productsService.getProductById(productId)

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
    const { id: credentialId } = request.auth.credentials

    const { productName, brand, stock, capitalPrice, sellingPrice, discount } =
      request.payload

    await this._productsService.verifyProductOwner(productId, credentialId)
    await this._productsService.updateProductById(productId, {
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
    const { id: credentialId } = request.auth.credentials

    await this._productsService.verifyProductOwner(productId, credentialId)
    await await this._productsService.deleteProductById(productId)
    return {
      status: 'success',
      message: 'Berhasil menghapus produk'
    }
  }
}

module.exports = ProductsHandler
