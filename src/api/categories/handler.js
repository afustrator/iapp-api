const autoBind = require('auto-bind')

class CategoriesHandler {
  constructor(categoriesService, productsService, validator) {
    this._categoriesService = categoriesService
    this._productsService = productsService
    this._validator = validator

    autoBind(this)
  }

  async postCategoryHandler(request, h) {
    this._validator.validateCategoryPayload(request.payload)
    const { name } = request.payload
    const { id: credentialId } = request.auth.credentials

    const categoryId = await this._categoriesService.addCategory({
      name,
      owner: credentialId
    })

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan kategori',
      data: {
        categoryId
      }
    })
    response.code(201)
    return response
  }

  async getCategoriesHandler(request) {
    const { id: credentialId } = request.auth.credentials
    const categories = await this._categoriesService.getCategories(credentialId)

    return {
      status: 'success',
      data: {
        categories
      }
    }
  }

  async getCategoryByIdHandler(request, h) {
    const { categoryId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._categoriesService.verifyCategoryOwner(categoryId, credentialId)
    const category = await this._categoriesService.getCategoryById(categoryId)
    const product = await this._productsService.getProducts({ categoryId })
    return {
      status: 'success',
      data: {
        category: {
          ...category,
          products: product
        }
      }
    }
  }

  async putCategoryByIdHandler(request) {
    const { categoryId } = request.params
    const { name } = request.payload
    const { id: credentialId } = request.auth.credentials

    await this._categoriesService.verifyCategoryOwner(categoryId, credentialId)
    await this._categoriesService.updateCategoryById(categoryId, { name })

    return {
      status: 'success',
      message: 'Kategori berhasil diperbarui'
    }
  }

  async deleteCategoryByIdHandler(request) {
    const { categoryId } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._categoriesService.verifyCategoryOwner(categoryId, credentialId)
    await this._categoriesService.deleteCategoryById(categoryId)

    return {
      status: 'success',
      message: 'Kategori berhasil dihapus'
    }
  }
}

module.exports = CategoriesHandler
