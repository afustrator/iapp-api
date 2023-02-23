const { Pool } = require('pg')
const { nanoid, customAlphabet } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const { mapProductsDBToModel, mapProductDBToModel } = require('../../utils')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError')

class ProductsService {
  constructor() {
    this._pool = new Pool()
  }

  async addProduct({ name, stock, price, categoryId, expireDate, owner }) {
    const generateProductCode = customAlphabet('1234567890', 14)

    const productId = `product-${nanoid(24)}`
    const stockId = `stock-${nanoid(16)}`
    const barcode = `P${generateProductCode()}`
    const createdAt = Date.now()
    const inputDate = Date.now()

    const productQuery = {
      text: 'INSERT INTO products VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
      values: [
        productId,
        barcode,
        name,
        price,
        categoryId,
        expireDate,
        inputDate,
        owner,
        createdAt,
        createdAt
      ]
    }

    //* Update stock */
    const stockQuery = {
      text: 'INSERT INTO stocks(id, product_id, stock, sale, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6)',
      values: [stockId, productId, stock, 0, createdAt, createdAt]
    }

    const result = await this._pool.query(productQuery)
    await this._pool.query(stockQuery)

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan produk')
    }

    return productId
  }

  async getProducts(owner, { name = '' }) {
    const query = {
      text: `
      SELECT
      products.id, products.barcode, products.name, stocks.stock, products.price,
      products.category_id, products.expire_date, products.input_date,
      products.created_at, products.updated_at
      FROM products
      LEFT JOIN stocks ON stocks.product_id = products.id
      WHERE owner = $1 AND LOWER(name) LIKE $2`,
      values: [owner, `%${name}%`]
    }

    const result = await this._pool.query(query)

    return result.rows.map(mapProductDBToModel)
  }

  async getProductsByCategoryId({ categoryId }) {
    const query = {
      text: `
      SELECT
      products.id, products.barcode, products.name, stocks.stock, products.price, products.category_id, products.expire_date, products.input_date
      FROM products
      LEFT JOIN stocks ON stocks.product_id = products.id
      LEFT JOIN categories ON categories.id = products.category_id
      WHERE category_id = $1`,
      values: [categoryId]
    }

    const result = await this._pool.query(query)

    return result.rows.map(mapProductsDBToModel)
  }

  async getProductById(productId) {
    const query = {
      text: `
      SELECT
      products.id, products.barcode, products.name, stocks.stock, products.price, products.category_id, products.expire_date, products.input_date, products.created_at, products.updated_at
      FROM products
      LEFT JOIN stocks ON stocks.product_id = products.id
      WHERE products.id = $1`,
      values: [productId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal mendapatkan produk. Id tidak ditemukan')
    }

    return result.rows[0]
  }

  async updateProductById(productId, { name, stock, price }) {
    const updatedAt = Date.now()

    const productQuery = {
      text: 'UPDATE products SET name = $1, price = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, price, updatedAt, productId]
    }

    //* Update stock */
    const stockQuery = {
      text: `UPDATE stocks SET stock = stock + ${stock} WHERE product_id = $1`,
      values: [productId]
    }

    const result = await this._pool.query(productQuery)
    await this._pool.query(stockQuery)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui produk. Id tidak ditemukan')
    }
  }

  async deleteProductById(productId) {
    const query = {
      text: 'DELETE FROM products WHERE id = $1 RETURNING id',
      values: [productId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus produk. Id tidak ditemukan')
    }
  }

  async verifyProductOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM products WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Produk tidak ditemukan')
    }

    const product = result.rows[0]

    if (product.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }
  }
}

module.exports = ProductsService
