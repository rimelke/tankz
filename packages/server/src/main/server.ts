import 'dotenv/config'
import AppError from '@errors/AppError'
import mongodb from '@infra/mongodb'
import { ApolloServer, UserInputError } from 'apollo-server'
import { schema } from './graphql'
import makeSocketServer from '@main/socket'

const apolloServer = new ApolloServer({
  schema,
  csrfPrevention: true,
  formatError: (err) => {
    if (err.originalError instanceof AppError)
      return new UserInputError(err.originalError.message)

    return err
  },
  context: ({ req }) => {
    const authorization = req.headers.authorization

    return { authorization }
  }
})

const main = async () => {
  await mongodb.connect()

  const { server, url } = await apolloServer.listen()

  makeSocketServer({ server })

  console.log(`[Apollo] Server ready at ${url}`)
}

main()
