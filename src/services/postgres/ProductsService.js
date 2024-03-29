const { Pool } = require('pg')
const { nanoid, customAlphabet } = require('nanoid')
const { mapProductsDBToModel, mapProductDBToModel } = require('../../utils')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError')

class ProductsService {
  constructor(cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async addProduct({ name, stock, price, categoryId, expireDate, owner }) {
    const generateProductCode = customAlphabet('1234567890', 14)

    const productId = `product-${nanoid(24)}`
    const stockId = `stock-${nanoid(16)}`
    const barcode = `P${generateProductCode()}`
    const createdAt = new Date().toUTCString()
    const inputDate = new Date().toUTCString()
    const sale = 0

    const productQuery = {
      text: `INSERT 
        INTO products
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id`,
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
        createdAt,
      ],
    }

    //* Update stock */
    const stockQuery = {
      text: `INSERT
        INTO stocks
        VALUES($1, $2, $3, $4, $5, $6)`,
      values: [stockId, productId, stock, sale, createdAt, createdAt],
    }

    const result = await this._pool.query(productQuery)
    await this._pool.query(stockQuery)

    if (!result.rows[0].id) {
      throw new InvariantError('Produk gagal ditambahkan')
    }

    await this._cacheService.delete(`products:${owner}`)
    await this._cacheService.delete(`product:${categoryId}`)
    return productId
  }

  async getProducts(owner, { name = '', page = 1, limit = 20 }) {
    const rowsQuery = {
      text: `SELECT
        COUNT(id) as total
        FROM products
        WHERE owner = $1`,
      values: [owner],
    }

    const totalRows = await this._pool.query(rowsQuery)

    const { total } = totalRows.rows[0]
    const totalPages = Math.ceil(total / limit)
    const offset = limit * (page - 1)

    try {
      const result = await this._cacheService.get(`
        products:${owner} AND @name:${name} 
        limit${limit} offset${offset}
      `)
      const product = JSON.parse(result)

      return {
        products: product,
        meta: {
          page,
          total,
          totalPages,
        },
      }
    } catch (error) {
      const query = {
        text: `
      SELECT
      products.id, products.barcode, products.name,
      stocks.stock, products.price, products.category_id,
      TO_CHAR(products.expire_date AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') as expire_date,
      TO_CHAR(products.input_date AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') as input_date
      FROM products
      LEFT JOIN stocks ON stocks.product_id = products.id
      WHERE owner = $1 AND LOWER(name) LIKE $2
      LIMIT $3 OFFSET $4`,
        values: [owner, `%${name}%`, limit, offset],
      }

      const result = await this._pool.query(query)
      const productRow = result.rows.map(mapProductDBToModel)
      await this._cacheService.set(
        `products:${owner}`,
        JSON.stringify(productRow)
      )

      return {
        products: productRow,
        meta: {
          page,
          total,
          totalPages,
        },
      }
    }
  }

  async getProductsByCategoryId({ categoryId }) {
    try {
      const result = await this._cacheService.get(`product:${categoryId}`)
      const product = JSON.parse(result)

      return product
    } catch (error) {
      const query = {
        text: `SELECT
          products.id, products.barcode, products.name,
          stocks.stock, products.price, products.category_id,
          TO_CHAR(products.expire_date AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') as expire_date,
          TO_CHAR(products.input_date AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') as input_date
          FROM products
          LEFT JOIN stocks ON stocks.product_id = products.id
          LEFT JOIN categories ON categories.id = products.category_id
          WHERE products.category_id = $1`,
        values: [categoryId],
      }

      const result = await this._pool.query(query)
      const product = result.rows.map(mapProductsDBToModel)
      await this._cacheService.set(
        `product:${categoryId}`,
        JSON.stringify(product)
      )

      return product
    }
  }

  async getProductById(productId) {
    try {
      const result = await this._cacheService.get(`productOne:${productId}`)
      const product = JSON.parse(result)

      return product
    } catch (error) {
      const query = {
        text: `SELECT
      products.id, products.barcode, products.name,
      stocks.stock, products.price, products.category_id,
      TO_CHAR(products.expire_date AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') as expire_date,
      TO_CHAR(products.input_date AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') as input_date,
			TO_CHAR(products.created_at AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') as created_at,
      TO_CHAR(products.updated_at AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') as updated_at
      FROM products
      LEFT JOIN stocks ON stocks.product_id = products.id
      WHERE products.id = $1`,
        values: [productId],
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) {
        throw new NotFoundError('Gagal mendapatkan produk. Id tidak ditemukan')
      }

      const product = result.rows[0]
      await this._cacheService.set(
        `productOne:${productId}`,
        JSON.stringify(product)
      )

      return product
    }
  }

  async updateProductById(productId, { name, stock, price }) {
    const updatedAt = new Date().toUTCString()

    const productQuery = {
      text: `UPDATE products
        SET name = $1, price = $2, updated_at = $3
        WHERE id = $4
        RETURNING id`,
      values: [name, price, updatedAt, productId],
    }

    //* Update stock */
    const stockQuery = {
      text: `UPDATE stocks
        SET stock = stock + $1
        WHERE product_id = $2`,
      values: [stock, productId],
    }

    const result = await this._pool.query(productQuery)
    await this._pool.query(stockQuery)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui produk. Id tidak ditemukan')
    }

    const { owner, category_id: categoryId } = result.rows[0]
    await this._cacheService.delete(`products:${owner}`)
    await this._cacheService.delete(`product:${categoryId}`)
    await this._cacheService.delete(`productOne:${productId}`)
  }

  async deleteProductById(productId) {
    const query = {
      text: `DELETE
        FROM products 
        WHERE id = $1
        RETURNING id`,
      values: [productId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus produk. Id tidak ditemukan')
    }

    const { owner, category_id: categoryId } = result.rows[0]
    await this._cacheService.delete(`products:${owner}`)
    await this._cacheService.delete(`product:${categoryId}`)
    await this._cacheService.delete(`productOne:${productId}`)
  }

  async verifyProductOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM products WHERE id = $1',
      values: [id],
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
