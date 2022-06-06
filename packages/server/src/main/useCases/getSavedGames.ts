import makeMongoGameRepository from '@repositories/implementations/mongoGameRepository'
import makeGetSavedGames from '@useCases/getSavedGames'

const mongoGameRepository = makeMongoGameRepository()

const getSavedGames = makeGetSavedGames({ gameRepository: mongoGameRepository })

export { getSavedGames }
