const { Pool } = require('pg')
const { nanoid, customAlphabet } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const {
	mapOrderItemsDBToModel,
	mapOrderDBToModel,
	mapOrdersDBToModel,
} = require('../../utils')

class OrdersService {
	constructor(cacheService) {
		this._pool = new Pool()
		this._cacheService = cacheService
	}

	async addOrder({ userId, name, address, phone, items }) {
		const months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		]

		const date = new Date()
		const day = date.getDate()
		const month = months[date.getMonth()]
		const year = date.getFullYear()
		const generateInvoice = customAlphabet('1234567890', 10)

		//* Check Stock */
		const stocksQuery = await this._pool.query(`
      SELECT product_id, stock, sale
      FROM stocks 
      WHERE product_id
      IN (${items.map((i) => `'${i.productId}'`).join()})
    `)
		const stocks = stocksQuery.rows

		const itemsWithStock = items.map((item) => ({
			...item,
			stock: stocks.find((sp) => sp.product_id === item.productId).stock,
			sale: stocks.find((sp) => sp.product_id === item.productId).sale,
		}))

		const checkStock = itemsWithStock
			.map((iws) => +iws.stock - +iws.quantity)
			.every((i) => i >= 0)
		if (!checkStock) {
			throw new InvariantError('Transaksi gagal: Stok tidak cukup')
		}

		//* Order */
		const id = `order-${nanoid(16)}`
		const invoice = `INV/${year}/${month}/${day}/${generateInvoice()}`
		const createdAt = new Date().toUTCString()

		const orderQuery = {
			text: `INSERT
          INTO orders
          VALUES($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id`,
			values: [id, userId, invoice, name, address, phone, createdAt, createdAt],
		}

		const order = await this._pool.query(orderQuery)
		const orderId = order.rows[0].id

		await itemsWithStock.map(async (item) => {
			const id = `orderItem-${nanoid(14)}`

			await this._pool.query(`
          UPDATE stocks
          SET
          stock = '${+item.stock - +item.quantity}', 
          sale = '${+item.sale + +item.quantity}'
          WHERE product_id = '${item.productId}'
        `)

			const itemQuery = {
				text: `INSERT
            INTO order_items
            VALUES($1, $2, $3, $4, $5, $6, $7)`,
				values: [
					id,
					orderId,
					item.productId,
					item.quantity,
					item.price,
					createdAt,
					createdAt,
				],
			}

			await this._pool.query(itemQuery)
		})

		await this._cacheService.delete(`orders:${userId}`)
		return orderId
	}

	async getOrders(userId, { page = 1, limit = 20 }) {
		/** Count data order */
		const recordQuery = {
			text: `SELECT
        COUNT(orders.id) as total
        FROM orders
        WHERE user_id = $1`,
			values: [userId],
		}

		const numRows = await this._pool.query(recordQuery)

		const { total } = numRows.rows[0]

		const totalPages = Math.ceil(total / limit)
		const offset = limit * (page - 1)

		try {
			const result = await this._cacheService.get(
				`orders:${userId} limit:${limit} offset:${offset}`
			)
			const dataOrders = JSON.parse(result)

			return {
				orders: dataOrders,
				meta: {
					page,
					total,
					totalPages,
				},
			}
		} catch (error) {
			const query = {
				text: `SELECT
        orders.id, orders.invoice,
        orders.name, users.fullname as cashier,
        TO_CHAR(orders.created_at AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') as order_date
        FROM orders
        LEFT JOIN users ON users.id = orders.user_id
        WHERE user_id = $1
        LIMIT $2 OFFSET $3`,
				values: [userId, limit, offset],
			}

			const result = await this._pool.query(query)
			const dataOrders = result.rows.map(mapOrdersDBToModel)
			await this._cacheService.set(
				`orders:${userId}`,
				JSON.stringify(dataOrders)
			)

			return {
				orders: dataOrders,
				meta: {
					page,
					total,
					totalPages,
				},
			}
		}
	}

	async getOrderById(orderId) {
		try {
			const resultOrder = await this._cacheService.get(`order:${orderId}`)
			const resultItems = await this._cacheService.get(`items:${orderId}`)
			const order = JSON.parse(resultOrder)
			const itemsRow = JSON.parse(resultItems)

			return {
				...order,
				items: itemsRow,
			}
		} catch (error) {
			const query = {
				text: `SELECT
        orders.id, users.fullname as cashier,
        orders.invoice, orders.name,
        orders.address, orders.phone
        FROM orders
        RIGHT JOIN users ON users.id = orders.user_id
        WHERE orders.id = $1`,
				values: [orderId],
			}

			const result = await this._pool.query(query)

			if (!result.rows.length) {
				throw new NotFoundError(
					'Gagal mendapatkan data order. Id tidak ditemukan'
				)
			}

			const order = result.rows.map(mapOrderDBToModel)[0]
			await this._cacheService.set(`order:${orderId}`, JSON.stringify(order))

			const itemsQuery = {
				text: `SELECT
        products.id, products.barcode, products.name,
        TO_CHAR(products.expire_date AT TIME ZONE 'Asia/Jakarta', 'YYYY-MM-DD HH24:MI:SS') as expire_date,
        order_items.quantity, order_items.price,
        ROUND(order_items.price * order_items.quantity) as sub_total
        FROM order_items
        LEFT JOIN products ON products.id = order_items.product_id
        WHERE order_items.order_id = $1`,
				values: [orderId],
			}
			const items = await this._pool.query(itemsQuery)
			const itemsRow = items.rows.map(mapOrderItemsDBToModel)
			await this._cacheService.set(`items:${orderId}`, JSON.stringify(itemsRow))

			return {
				...order,
				items: itemsRow,
			}
		}
	}
}

module.exports = OrdersService
