const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const bcrpyt = require('bcrypt')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class UsersService {
  constructor() {
    this._pool = new Pool()
  }

  async addUser({ username, password, fullname }) {
    await this.verifyUsername(username)

    const id = `user-${nanoid(24)}`
    const hashedPassword = await bcrpyt.hash(password, 10)
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan user.')
    }

    return result.rows[0].id
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id = $1',
      values: [userId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan')
    }

    return result.rows[0]
  }

  async verifyUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username]
    }

    const result = await this._pool.query(query)

    if (result.rows.length > 0) {
      throw new InvariantError(
        'Gagal menambahkan user. Username sudah digunakan.'
      )
    }
  }
}

module.exports = UsersService
