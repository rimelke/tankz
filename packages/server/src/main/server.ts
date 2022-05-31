import 'dotenv/config'
import AppError from '@errors/AppError'
import mongodb from '@infra/mongodb'
import { ApolloServer, UserInputError } from 'apollo-server'
import { schema, resolvers } from './graphql'

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  csrfPrevention: true,
  formatError: (err) => {
    if (err.originalError instanceof AppError)
      return new UserInputError(err.originalError.message)

    return err
  }
})

const main = async () => {
  await mongodb.connect()

  const { url } = await server.listen()

  console.log(`[Apollo] Server ready at ${url}`)
}

main()
