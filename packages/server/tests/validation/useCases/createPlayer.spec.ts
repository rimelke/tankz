import makeCreatePlayerValidator from '@validation/useCases/createPlayer'

describe('createPlayerValidator', () => {
  const createPlayerValidator = makeCreatePlayerValidator()

  it('should contain nickname schema', () => {
    expect(createPlayerValidator.schema.nickname).toBeDefined()
    expect(createPlayerValidator.schema.nickname.length).toBe(3)
    expect(createPlayerValidator.schema.nickname[0]).toBe('isRequired')
    expect(createPlayerValidator.schema.nickname[1]).toBe('isString')
    expect(createPlayerValidator.schema.nickname[2]).toEqual({
      type: 'isMin',
      value: 5
    })
  })

  it('should contain password schema', () => {
    expect(createPlayerValidator.schema.password).toBeDefined()
    expect(createPlayerValidator.schema.password.length).toBe(3)
    expect(createPlayerValidator.schema.password[0]).toBe('isRequired')
    expect(createPlayerValidator.schema.password[1]).toBe('isString')
    expect(createPlayerValidator.schema.password[2]).toEqual({
      type: 'isMin',
      value: 8
    })
  })
})
