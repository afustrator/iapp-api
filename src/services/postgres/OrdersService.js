// const { Pool } = require('pg')
// const { nanoid, customAlphabet } = require('nanoid')
// const InvariantError = require('../../exceptions/InvariantError')

// class OrdersService {
//   constructor() {
//     this._pool = new Pool()
//   }

//   async addOrder({ items, itemQuantity, sellingPrice, userId, discount }) {
//     //* Cek Stok */
//     const stockQuery = await this._pool.query(`
//       SELECT stock FROM products
//       WHERE id IN (${items.map((i) => `'${i.productId}'`).join()})`)
//     const stocks = stockQuery.rows
//     const itemWithStock = items.map((item) => ({
//       ...item,
//       stock: stocks.find((sp) => sp.id === item.productId).stock,
//       order: stocks.find((sp) => sp.id === item.productId).order
//     }))
//     const checkStock = itemWithStock
//       .map((iws) => +iws.stock - +iws.quantity)
//       .every((i) => i >= 0)
//     if (!checkStock) {
//       throw new InvariantError('Transaksi gagal: Stok tidak cukup')
//     }

//     const client = await this._pool.connect()
//     try {
//       await client.query('BEGIN')

//       const generateInvoice = customAlphabet('1234567890', 14)

//       const id = `order-${nanoid(24)}`
//       const invoice = `INV${generateInvoice()}`
//       const createdAt = Date.now()
//       const totalPrice = itemQuantity * sellingPrice

//       const orderQuery = {
//         text: `INSERT INTO order_details
//           VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
//         values: [
//           id,
//           invoice,
//           items,
//           itemQuantity,
//           sellingPrice,
//           totalPrice,
//           createdAt,
//           createdAt
//         ]
//       }

//       const order = await this._pool.query(orderQuery)
//       const orderId = order.rows[0].id

//       await itemWithStock.map(async (item) => {
//         await client.query(
//           `UPDATE products SET stock = '${
//             +item.stock - +item.quantity
//           }' WHERE id = '${item.productId}'`
//         )

//         const itemQuery = {
//           text: `INSERT INTO orders(id, invoice, user_id, stock_quantity, discount, total_price, created_at, updated_at) VALUES('${orderId}', '${invoice}', '${userId}', '${item.quantity}', '${discount}', '${totalPrice}', '${createdAt}', '${createdAt}')`
//         }

//         await client.query(itemQuery)
//       })

//       await client.query('COMMIT')

//       return orderId
//     } catch (error) {
//       await client.query('ROLLBACK')
//       throw new InvariantError(`Transaksi gagal: ${error.message}`)
//     } finally {
//       client.release()
//     }

//     // const generateInvoice = customAlphabet('1234567890', 14)

//     // const id = `order-${nanoid(24)}`
//     // const invoice = `INV${generateInvoice()}`
//     // const createdAt = Date.now()
//     // const sellingPrice = await this._pool.query(`
//     //   SELECT selling_price
//     //   FROM products
//     //   WHERE id =  ${productId}`)

//     // const totalPrice = itemQuantity * sellingPrice

//     // const orderQuery = {
//     //   text: `INSERT INTO order_details
//     //     VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
//     //   values: [
//     //     id,
//     //     invoice,
//     //     productId,
//     //     itemQuantity,
//     //     sellingPrice,
//     //     totalPrice,
//     //     createdAt,
//     //     createdAt
//     //   ]
//     // }

//     // const order = await this._pool.query(orderQuery)
//     // const orderId = order.rows[0].id

//     // await this._pool.query(
//     //   `UPDATE products SET stock = stock - ${itemQuantity}
//     //   WHERE product_id = ${productId}`
//     // )

//     // await this._pool.query(
//     //   `INSERT INTO
//     //   orders(id, invoice, user_id, stock_quantity, discount, total_price, created_at, updated_at)
//     //   VALUES(${id}, ${invoice}, ${userId}, ${itemQuantity}, ${totalPrice}, ${createdAt} ${createdAt})`
//     // )

//     // return orderId
//   }

//   async checkStock(productId) {
//     const query = {
//       text: 'SELECT stock FROM products WHERE id = $1',
//       values: [productId]
//     }

//     const result = await this._pool.query(query)

//     if (result.rows.length === 0) {
//       throw new InvariantError('Transaksi gagal: Stok telah habis')
//     }
//   }
// }

// module.exports = OrdersService
