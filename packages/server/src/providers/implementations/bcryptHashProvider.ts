import HashProvider from '@providers/HashProvider'
import bcrypt from 'bcrypt'

const makeBcryptHashProvider = (): HashProvider => {
  const bcryptHashProvider: HashProvider = {
    hash: (value) => bcrypt.hash(value, 12),
    compare: (value, hash) => bcrypt.compare(value, hash)
  }

  return bcryptHashProvider
}

export default makeBcryptHashProvider
