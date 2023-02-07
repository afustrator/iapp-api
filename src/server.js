require('dotenv').config()

const Hapi = require('@hapi/hapi')
const ClientError = require('./exceptions/ClientError')
const Laabr = 'laabr'
const laabr = require(Laabr)

/** Categories */
const categories = require('./api/categories')
const CategoriesService = require('../src/services/postgres/CategoriesService')
const CategoriesValidator = require('../src/validator/categories')

/** Products */
const products = require('./api/products')
const ProductsService = require('../src/services/postgres/ProductsService')
const ProductsValidator = require('../src/validator/products')

/** Customers */
const customers = require('./api/customers')
const CustomersService = require('../src/services/postgres/CustomersService')
const CustomersValidator = require('../src/validator/customers')

/** Users */
const users = require('./api/users')
const UsersService = require('../src/services/postgres/UsersService')
const UsersValidator = require('../src/validator/users')

const server = Hapi.server({
  host: process.env.HOST,
  port: process.env.PORT,
  routes: {
    cors: {
      origin: ['*']
    }
  }
})

const init = async () => {
  /** Initialize Services */
  const categoriesService = new CategoriesService()
  const productsService = new ProductsService()
  const customersService = new CustomersService()
  const usersService = new UsersService()

  server.route([
    {
      method: 'GET',
      path: '/',
      handler: () => ({
        data: {
          status: 'Ok',
          message: 'Iapp API',
          version: '1.0.0'
        }
      })
    },
    {
      method: '*',
      path: '/{p*}', // catch-all path
      handler: (request, h) => {
        const response = h.response({
          status: '404',
          message: 'Not Found'
        })
        response.code(404)
        return response
      }
    }
  ])

  /** Handler Error */
  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request
    if (response instanceof Error) {
      // penangan client error secara internal
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        })
        newResponse.code(response.statusCode)
        return newResponse
      }
      // mempertahankan penangan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.response
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.'
      })
      newResponse.code(500)
      return newResponse
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue
  })

  /** Register API Plugins */
  await server.register([
    {
      plugin: categories,
      options: {
        categoriesService,
        productsService,
        validator: CategoriesValidator
      }
    },
    {
      plugin: products,
      options: {
        service: productsService,
        validator: ProductsValidator
      }
    },
    {
      plugin: customers,
      options: {
        service: customersService,
        validator: CustomersValidator
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    }
  ])

  /** Logging using Laabr */
  await server.register({
    plugin: laabr,
    options: {
      colored: true
    }
  })

  /** Running the server */
  await server.start()
}

init()

module.exports = server
