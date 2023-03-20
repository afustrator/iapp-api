const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError')
const { mapCategoriesDBToModel, mapCategoryDBToModel } = require('../../utils')

// On Progess: Cache in this service

class CategoriesService {
  constructor(cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async addCategory({ name, owner }) {
    const id = `category-${nanoid(24)}`
    const createdAt = new Date().toUTCString()

    const query = {
      text: `INSERT
        INTO categories
        VALUES($1, $2, $3, $4, $5)
        RETURNING id`,
      values: [id, name, owner, createdAt, createdAt],
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Kategori gagal ditambahkan')
    }

    await this._cacheService.delete(`categories${owner}`)
    return result.rows[0].id
  }

  async getCategories(owner) {
    try {
      const result = await this._cacheService.get(`categories:${owner}`)
      const categories = JSON.parse(result)

      return categories
    } catch (error) {
      const query = {
        text: `SELECT *
        FROM categories
        WHERE owner = $1`,
        values: [owner],
      }

      const result = await this._pool.query(query)
      const categories = result.rows.map(mapCategoriesDBToModel)
      await this._cacheService.set(
        `categories:${owner}`,
        JSON.stringify(categories)
      )

      return categories
    }
  }

  async getCategoryById(categoryId) {
    try {
      const result = await this._cacheService.get(`category:${categoryId}`)
      const category = JSON.parse(result)

      return category
    } catch (error) {
      const query = {
        text: `SELECT id, name, owner, 
				TO_CHAR(created_at AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') as created_at,
				TO_CHAR(updated_at AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') as updated_at
        FROM categories
        WHERE id = $1`,
        values: [categoryId],
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) {
        throw new NotFoundError(
          'Gagal mendapatkan kategori. Id tidak ditemukan'
        )
      }

      const category = result.rows.map(mapCategoryDBToModel)[0]
      await this._cacheService.set(
        `category:${categoryId}`,
        JSON.stringify(category)
      )

      return category
    }
  }

  async updateCategoryById(categoryId, { name }) {
    const updatedAt = new Date().toUTCString()

    const query = {
      text: `UPDATE categories
        SET name = $1, updated_at = $2
        WHERE id = $3
        RETURNING id`,
      values: [name, updatedAt, categoryId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui kategori. Id tidak ditemukan')
    }

    const { owner } = result.rows[0]
    await this._cacheService.delete(`categories:${owner}`)
    await this._cacheService.delete(`category:${categoryId}`)
  }

  async deleteCategoryById(categoryId) {
    const query = {
      text: `DELETE
        FROM categories
        WHERE id = $1
        RETURNING id`,
      values: [categoryId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus kategori. Id tidak ditemukan')
    }

    const { owner } = result.rows[0]
    await this._cacheService.delete(`categories:${owner}`)
    await this._cacheService.delete(`category:${categoryId}`)
  }

  async verifyCategoryOwner(id, owner) {
    const query = {
      text: `SELECT *
        FROM categories
        WHERE id = $1`,
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Kategori tidak ditemukan')
    }

    const category = result.rows[0]

    if (category.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }
  }
}

module.exports = CategoriesService
