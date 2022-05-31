import { Player } from '@entities/player'
import mongodb from '@infra/mongodb'
import PlayerRepository from '@repositories/PlayerRepository'
import { Document, Filter } from 'mongodb'

const makeMongoPlayerRepository = (): PlayerRepository => {
  const playerCollection = mongodb.getCollection('players')

  const findPlayer = async (params: Filter<Document>) => {
    const result = await playerCollection.findOne(params)

    if (!result) return

    const { _id, ...data } = result

    return { ...data, id: _id.toString() } as Player
  }

  const mongoPlayerRepository: PlayerRepository = {
    async create(data) {
      const { insertedId } = await playerCollection.insertOne(data)

      return { ...data, id: insertedId.toString() }
    },
    findByNickname(nickname) {
      return findPlayer({ nickname })
    },
    findById(id) {
      return findPlayer({ _id: id })
    }
  }

  return mongoPlayerRepository
}

export default makeMongoPlayerRepository
