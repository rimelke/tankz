interface TokenProvider {
  generate(playerId: string): Promise<string>
  validate(token: string): Promise<string>
}

export default TokenProvider
