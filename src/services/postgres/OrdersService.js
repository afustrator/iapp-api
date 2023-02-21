const { Pool } = require('pg')
const { nanoid, customAlphabet } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')

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
}

module.exports = OrdersService
