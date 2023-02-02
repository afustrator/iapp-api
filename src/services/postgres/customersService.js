const { Pool } = require('pg')
const { customAlphabet } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const { mapCustomerDBToModel } = require('../../utils')

class CustomersService {
  constructor() {
    this._pool = new Pool()
  }

  async addCustomer({ customerName, address, phoneNumber }) {
    const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 10)

    const id = `customer-${nanoid()}`
    const createdAt = Date.now()

    const query = {
      text: 'INSERT INTO customers VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, customerName, address, phoneNumber, createdAt, createdAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan data pembeli')
    }

    return result.rows[0].id
  }

  async getCustomers() {
    const result = await this._pool.query(`
      SELECT * FROM customers
    `)

    return result.rows.map(mapCustomerDBToModel)
  }

  async getCustomerById(customerId) {
    const query = {
      text: 'SELECT * FROM customers WHERE id = $1',
      values: [customerId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError(
        'Gagal mendapatkan data pembeli. Id tidak ditemukan'
      )
    }

    return result.rows.map(mapCustomerDBToModel)[0]
  }

  async updateCustomerById(customerId, { customerName, address, phoneNumber }) {
    const updatedAt = Date.now()

    const query = {
      text: 'UPDATE customers SET customer_name = $1, address = $2, phone_number = $3, updated_at = $4 WHERE id = $5 RETURNING id',
      values: [customerName, address, phoneNumber, updatedAt, customerId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError(
        'Gagal memperbarui data pembeli. Id tidak ditemukan'
      )
    }
  }

  async deleteCustomerById(customerId) {
    const query = {
      text: 'DELETE FROM customers WHERE id = $1 RETURNING id',
      values: [customerId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError(
        'Gagal menghapus data pembeli. Id tidak ditemukan'
      )
    }
  }
}

module.exports = CustomersService
