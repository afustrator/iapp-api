const { Pool } = require('pg')
const { nanoid, customAlphabet } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class OrdersService {
  constructor() {
    this._pool = new Pool()
  }

  async addOrder({ userId, name, address, phone, items }) {
    const generateInvoice = customAlphabet('1234567890', 10)

    //* Check Stock */
    const stocksQuery = await this._pool.query(`
      SELECT product_id, stock, sale
      FROM stocks 
      WHERE product_id
      IN (${items.map((i) => `'${i.productId}'`).join()})`)
    const stocks = stocksQuery.rows
    const itemsWithStock = items.map((item) => ({
      ...item,
      stock: stocks.find((sp) => sp.product_id === item.productId).stock,
      sale: stocks.find((sp) => sp.product_id === item.productId).sale
    }))
    const checkStock = itemsWithStock
      .map((iws) => +iws.stock - +iws.quantity)
      .every((i) => i >= 0)
    if (!checkStock) {
      throw new InvariantError('Transaksi gagal: Stok tidak cukup')
    }

    const client = await this._pool.connect()

    //* Order */
    try {
      await client.query('BEGIN')

      const id = `order-${nanoid(16)}`
      const invoice = `INV${generateInvoice()}`
      const createdAt = Date.now()

      const orderQuery = {
        text: 'INSERT INTO orders(id, user_id, invoice, name, address, phone, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        values: [
          id,
          userId,
          invoice,
          name,
          address,
          phone,
          createdAt,
          createdAt
        ]
      }

      const order = await client.query(orderQuery)
      const orderId = order.rows[0].id

      await itemsWithStock.map(async (item) => {
        const id = `orderItem-${nanoid(14)}`

        await client.query(`
          UPDATE stocks
          SET
          stock = '${+item.stock - +item.quantity}', 
          sale = '${+item.sale + +item.quantity}'
          WHERE product_id = '${item.productId}'
        `)

        const itemQuery = {
          text: `
            INSERT INTO
            order_items(id, order_id, product_id, quantity, price, created_at, updated_at)
            VALUES($1, $2, $3, $4, $5, $6, $7)`,
          values: [
            id,
            orderId,
            item.productId,
            item.quantity,
            item.price,
            createdAt,
            createdAt
          ]
        }

        await client.query(itemQuery)
      })

      await client.query('COMMIT')

      return orderId
    } catch (error) {
      await client.query('ROLLBACK')
      throw new InvariantError(`Transaksi gagal: ${error.message}`)
    } finally {
      client.release()
    }
  }

  async getOrders(userId, { page = 1, limit = 2 }) {
    /** Count data order */
    const recordQuery = {
      text: 'SELECT COUNT(orders.id) as total FROM orders WHERE user_id = $1',
      values: [userId]
    }

    const numRows = await this._pool.query(recordQuery)

    const { total } = numRows.rows[0]

    const totalPages = Math.ceil(total / limit)
    const offset = limit * (page - 1)

    const query = {
      text: `SELECT
        orders.id, orders.invoice, orders.name, users.fullname as cashier
        FROM orders
        LEFT JOIN users ON users.id = orders.user_id
        WHERE user_id = $1
        LIMIT $2 OFFSET $3`,
      values: [userId, limit, offset]
    }

    const { rows } = await this._pool.query(query)

    return {
      orders: rows,
      meta: {
        page,
        total,
        totalPages
      }
    }
  }

  async getOrderById(orderId) {
    const query = {
      text: `SELECT
        orders.id, users.fullname as cashier, 
        orders.invoice, orders.name, orders.address, orders.phone
        FROM orders
        LEFT JOIN users ON users.id = orders.user_id
        WHERE orders.id = $1`,
      values: [orderId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError(
        'Gagal mendapatkan data order. Id tidak ditemukan'
      )
    }

    const itemsQuery = {
      text: `SELECT
        products.id, products.barcode, products.name, products.expire_date,
        order_items.quantity, order_items.price,
        ROUND(order_items.price * order_items.quantity) as total_price
        FROM order_items
        LEFT JOIN products ON products.id = order_items.product_id
        WHERE order_items.order_id = $1`,
      values: [orderId]
    }

    const items = await this._pool.query(itemsQuery)

    return {
      ...result.rows[0],
      items: items.rows.map((row) => ({
        id: row.id,
        barcode: row.barcode,
        name: row.name,
        expireDate: row.expire_date,
        quantity: row.quantity,
        price: row.price,
        totalPrice: row.total_price
      }))
    }
  }
}

module.exports = OrdersService
