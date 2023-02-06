const { Pool } = require('pg')
const { nanoid, customAlphabet } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const { mapProductsDBToModel } = require('../../utils')
const NotFoundError = require('../../exceptions/NotFoundError')

class ProductsService {
  constructor() {
    this._pool = new Pool()
  }

  async addProduct({
    productName,
    brand,
    stock,
    capitalPrice,
    sellingPrice,
    discount,
    categoryId,
    expireDate
  }) {
    const generateProductCode = customAlphabet('1234567890', 14)

    const id = `product-${nanoid(24)}`
    const productCode = `P${generateProductCode()}`
    const createdAt = Date.now()
    const inputDate = Date.now()

    const query = {
      text: 'INSERT INTO products VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id',
      values: [
        id,
        productCode,
        productName,
        brand,
        stock,
        capitalPrice,
        sellingPrice,
        discount,
        categoryId,
        expireDate,
        inputDate,
        createdAt,
        createdAt
      ]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan produk')
    }

    return result.rows[0].id
  }

  async getProducts({ productName = '' }) {
    const query = {
      text: `
      SELECT
      products.id, products.product_code, products.product_name, products.brand, 
      products.stock, products.capital_price, products.selling_price, products.discount, 
      products.category_id, products.expire_date, products.input_date
      FROM products
      WHERE LOWER(product_name) LIKE $1`,
      values: [`%${productName}%`]
    }

    const result = await this._pool.query(query)

    return result.rows.map(mapProductsDBToModel)
  }

  async getProductById(productId) {
    const query = {
      text: `
      SELECT
      products.id, products.product_code, products.product_name, products.brand, 
      products.stock, products.capital_price, products.selling_price, products.discount,
      products.category_id, products.expire_date, products.input_date, 
      products.created_at, products. updated_at
      FROM products
      WHERE id = $1`,
      values: [productId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal mendapatkan produk. Id tidak ditemukan')
    }

    return result.rows[0]
  }

  async updateProductById(
    productId,
    { productName, brand, stock, capitalPrice, sellingPrice, discount }
  ) {
    const query = {
      text: 'UPDATE products SET product_name = $1, brand = $2, stock = $2, capital_price = $3, selling_price = $4, discount = $5 WHERE id = $6 RETURNING id',
      values: [
        productName,
        brand,
        stock,
        capitalPrice,
        sellingPrice,
        discount,
        productId
      ]
    }

    const result = await this._pool.query(query)

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
}

module.exports = ProductsService
