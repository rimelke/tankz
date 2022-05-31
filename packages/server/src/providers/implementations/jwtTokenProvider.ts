import AppError from '@errors/AppError'
import TokenProvider from '@providers/TokenProvider'
import jwt from 'jsonwebtoken'

const makeJwtTokenProvider = () => {
  const jwtTokenProvider: TokenProvider = {
    generate: (playerId: string) =>
      new Promise((resolve, reject) => {
        jwt.sign(
          { id: playerId },
          process.env.TOKEN_SECRET || 'TOKEN_SECRET',
          {
            expiresIn: 7 * 24 * 60 * 60 // 7 days
          },
          (err, authToken) => {
            if (err || !authToken) reject(err)
            else resolve(authToken)
          }
        )
      }),
    validate: async (authorization: string) => {
      if (!authorization) throw new AppError('no authorization provided')

      const parts = authorization.split(' ')

      if (parts.length !== 2) throw new AppError('authorization schema error')

      const [schema, token] = parts

      if (!/^Bearer$/i.test(schema))
        throw new AppError('authorization type error')

      return new Promise((resolve, reject) => {
        jwt.verify(
          token,
          process.env.SECRET || 'TOKEN_SECRET',
          (err, decoded: any) => {
            if (err || !decoded) reject(new AppError('invalid token'))
            else resolve(decoded.id)
          }
        )
      })
    }
  }

  return jwtTokenProvider
}

export default makeJwtTokenProvider
