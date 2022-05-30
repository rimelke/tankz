import { ApolloServer } from 'apollo-server'
import { schema, resolvers } from './graphql'

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  csrfPrevention: true
})

server.listen().then(({ url }) => {
  console.log(`[Apollo] Server ready at ${url}`)
})
