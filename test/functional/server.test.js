'use strict'

// requires for testing
const Code = require('code')
const Lab = require('lab')

const expect = Code.expect
const lab = (exports.lab = Lab.script())

// use some BDD verbage instead of lab default
const describe = lab.describe
const it = lab.it
const after = lab.after

// require hapi server
const server = require('../../src/server')

/** Test */
describe('functional test - category', () => {
  // it('')

  it('should get category', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/category'
    })

    expect(response.statusCode).to.equal(200)
  })

  it('should get category by id', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/category/category-yzl28lm1s7'
    })

    expect(response.statusCode).to.equal(200)
  })

  it('should return error for invalid id', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/category/category-yzl28lm1dw'
    })

    expect(response.statusCode).to.equal(404)
  })

  after(async () => {
    // placeholder to do something post tests
  })
})
