require('dotenv').config()

const { ENGINE_SERVICE_NAME } = process.env

module.exports = {
  client: {
    name: 'My Web Frontend',
    service: {
      name: ENGINE_SERVICE_NAME,
      localSchemaFile: '../typescript-graphql-modules-api/build/schema.graphql'
    },
    includes: [
      './graphql/**/*.graphql',
    ]
  }
}
