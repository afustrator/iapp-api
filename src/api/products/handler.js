const autoBind = require('auto-bind')

class ProductsHandler {
  constructor(productsService, validator) {
    this._productsService = productsService
    this._validator = validator

    autoBind(this)
  }

  async postProductHandler(request, h) {
    this._validator.validatePostProductPayload(request.payload)
    const { name, stock, price, categoryId, expireDate } = request.payload
    const { id: credentialId } = request.auth.credentials

    const productId = await this._productsService.addProduct({
      name,
      stock,
      price,
      categoryId,
      expireDate,
      owner: credentialId
    })

    const response = h.response({
      status: 'success',
      message: 'Produk berhasil ditambahkan',
      data: {
        productId
      }
    })
    response.code(201)
    return response
  }

  async getProductsHandler(request) {
    const { id: credentialId } = request.auth.credentials
    const { name, page } = request.query

    const { products, meta } = await this._productsService.getProducts(
      credentialId,
      {
        name,
        page
      }
    )

    return {
      status: 'success',
      data: {
        products,
        meta
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

    const { name, stock, price } = request.payload

    await this._productsService.verifyProductOwner(productId, credentialId)
    await this._productsService.updateProductById(productId, {
      name,
      stock,
      price
    })

    return {
      status: 'success',
      message: 'Produk berhasil diperbarui'
    }
  }

  async deleteProductByIdHandler(request) {
    const { productId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._productsService.verifyProductOwner(productId, credentialId)
    await await this._productsService.deleteProductById(productId)
    return {
      status: 'success',
      message: 'Produk berhasil dihapus'
    }
  }
}

module.exports = ProductsHandler
