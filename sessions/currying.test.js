/* global test describe */
const { pbkdf2 } = require('crypto')
const {
  curry,
  __,
  bind,
  compose,
  splitAt,
  tap,
  converge,
  last,
  always,
  head,
  partialRight,
  pipe
} = require('ramda')

const password = 'mypassword'
const salt = 'somelongrandomstringasasalt'
const iterations = 10
const len = 12
const digest = 'md5'

describe('Curring', () => {
  test('crypto example', (done) => {
    const curriedPbkdf2 = curry(pbkdf2)
    expect(typeof curriedPbkdf2).toBe('function')

    const withPassword = curriedPbkdf2(password)
    expect(typeof withPassword).toBe('function')

    const getKey = withPassword(salt)(iterations)(len)(digest)

    getKey((err, key) => {
      expect(err).toBeFalsy()
      expect(key instanceof Buffer).toBeTruthy()
      expect(key.toString().length).toBe(12)

      curriedPbkdf2(password, salt, iterations, len, digest)((err, verifiedKey) => {
        expect(verifiedKey).toEqual(key)
        done()
      })
    })
  })

  test('with placeholder', (done) => {
    const keyGen = curry(pbkdf2)
    const password = 'cats12'
    const salt = 'someuniquestringtoactasasalt'
    const iterations = 1000
    const len = 24
    const digest = 'sha512'
    const verify = keyGen(__, salt, iterations, len, digest)
    const create = verify(password)
    const stored = '0409757bb520dfc434eb9252b1176082324af3134f71e247'
    const cb = bind(done, (err, hash) => {
      expect(hash.toString('hex')).toEqual(stored)
      expect(hash.toString().length).toBe(24)
      done()
    })
    // create(cb)
    verify('cats12')(cb)
  })

  test('salt and key together', (done) => {
    const username = 'cat_lover'
    const password = 'cats12'
    const iterations = 1000
    const len = 24
    const digest = 'sha512'

    const keyGen = curry(pbkdf2)(password, __, iterations, len, digest)

    const getHashedPassword = always('0409757bb520dfc434eb9252b1176082324af3134f71e247someuniquestringtoactasasalt')

    const cb = (err, key, storedKey) => {
      expect(err).toBeFalsy()
      expect(key.toString('hex')).toEqual(storedKey)
      done()
    }
    const generateMatch = (storedKey, salt) => keyGen(salt)(partialRight(cb, [storedKey]))

    const verify = pipe(
      getHashedPassword,
      splitAt(48),
      converge(generateMatch, [head, last])
    )

    verify('cat_lover')
  })
})
