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
    validate: (token: string) =>
      new Promise((resolve, reject) => {
        jwt.verify(
          token,
          process.env.TOKEN_SECRET || 'TOKEN_SECRET',
          (err, decoded: any) => {
            if (err || !decoded) reject(err)
            else resolve(decoded.id)
          }
        )
      })
  }

  return jwtTokenProvider
}

export default makeJwtTokenProvider
