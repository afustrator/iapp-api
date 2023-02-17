require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const Laabr = 'laabr'
const laabr = require(Laabr)

const ClientError = require('./exceptions/ClientError')

/** Categories */
const categories = require('./api/categories')
const CategoriesService = require('./services/postgres/CategoriesService')
const CategoriesValidator = require('./validator/categories')

/** Products */
const products = require('./api/products')
const ProductsService = require('./services/postgres/ProductsService')
const ProductsValidator = require('./validator/products')

/** Users */
const users = require('./api/users')
const UsersService = require('./services/postgres/UsersService')
const UsersValidator = require('./validator/users')

/** Authentications */
const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/postgres/AuthenticationsService')
const TokenManager = require('./tokenize/TokenManager')
const AuthenticationsValidator = require('./validator/authentications')

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
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()

  /** Route Prefix */
  const prefix = (server.realm.modifiers.route.prefix = '/api/v1')

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

  /** Register Plugin Eksternal */
  await server.register([
    {
      plugin: Jwt
    }
  ])

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('iapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
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
        productsService,
        validator: ProductsValidator
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator
      }
    }
  ])

  /** Logging using Laabr */
  await server.register({
    plugin: laabr,
    options: {
      colored: true,
      formats: {
        onPostStart: `${new Date().toLocaleString()} :level :message at :host[uri]${prefix}`,
        response: ':time :method :url :status :payload (:responseTime ms)'
      }
    }
  })

  /** Running the server */
  await server.start()
}

init()

module.exports = server
