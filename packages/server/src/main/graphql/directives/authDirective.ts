import { mapSchema, MapperKind, getDirective } from '@graphql-tools/utils'
import { defaultFieldResolver, GraphQLSchema } from 'graphql'
import { gql } from 'apollo-server'
import makeJwtTokenProvider from '@providers/implementations/jwtTokenProvider'

export const authDirectiveSchema = gql`
  directive @auth on FIELD_DEFINITION
`

const tokenProvider = makeJwtTokenProvider()

const authDirective = (schema: GraphQLSchema) =>
  mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authDir = getDirective(schema, fieldConfig, 'auth')?.[0]

      if (authDir) {
        const { resolve = defaultFieldResolver, subscribe } = fieldConfig

        const getResolver =
          (callback: (...params: any[]) => unknown) =>
          async (source, args, context, info) => {
            const { authorization } = context

            const playerId = await tokenProvider.validate(authorization)

            return callback(source, args, { ...context, playerId }, info)
          }

        if (fieldConfig.resolve) fieldConfig.resolve = getResolver(resolve)
        else if (fieldConfig.subscribe)
          fieldConfig.subscribe = getResolver(subscribe)

        return fieldConfig
      }
    }
  })

export default authDirective
