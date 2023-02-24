const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError')
const { mapCategoryDBToModel } = require('../../utils')

class CategoriesService {
  constructor() {
    this._pool = new Pool()
  }

  async addCategory({ name, owner }) {
    const id = `category-${nanoid(24)}`
    const createdAt = Date.now()

    const query = {
      text: `INSERT
        INTO categories
        VALUES($1, $2, $3, $4, $5)
        RETURNING id`,
      values: [id, name, owner, createdAt, createdAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Kategori gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getCategories(owner) {
    const query = {
      text: `SELECT *
        FROM categories
        WHERE owner = $1`,
      values: [owner]
    }

    const result = await this._pool.query(query)

    return result.rows.map(mapCategoryDBToModel)
  }

  async getCategoryById(categoryId) {
    const query = {
      text: `SELECT *
        FROM categories
        WHERE id = $1`,
      values: [categoryId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal mendapatkan kategori. Id tidak ditemukan')
    }

    return result.rows.map(mapCategoryDBToModel)[0]
  }

  async updateCategoryById(categoryId, { name }) {
    const updatedAt = Date.now()

    const query = {
      text: `UPDATE categories
        SET name = $1, updated_at = $2
        WHERE id = $3
        RETURNING id`,
      values: [name, updatedAt, categoryId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui kategori. Id tidak ditemukan')
    }
  }

  async deleteCategoryById(categoryId) {
    const query = {
      text: `DELETE
        FROM categories
        WHERE id = $1
        RETURNING id`,
      values: [categoryId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus kategori. Id tidak ditemukan')
    }
  }

  async verifyCategoryOwner(id, owner) {
    const query = {
      text: `SELECT *
        FROM categories
        WHERE id = $1`,
      values: [id]
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
