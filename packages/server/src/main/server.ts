import AppError from '@errors/AppError'
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

server.listen().then(({ url }) => {
  console.log(`[Apollo] Server ready at ${url}`)
})
