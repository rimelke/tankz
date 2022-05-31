import defaultSchema from './schema'
import directives from './directives'
import authDirective from './directives/authDirective'
import { makeExecutableSchema } from '@graphql-tools/schema'
import resolvers from './resolvers'

export const schema = authDirective(
  makeExecutableSchema({
    typeDefs: [...directives, ...defaultSchema],
    resolvers
  })
)
