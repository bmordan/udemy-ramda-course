const {
  pipe,
  pipeP,
  init,
  split,
  tap,
  contains,
  curry,
  toString,
  partial
} = require('ramda')
const fs = require('fs')
const path = require('path')
const { pbkdf2 } = require('crypto')
const readDir = path.join(__dirname, '..', 'fixtures', 'passwords.txt')
const promiseReturner = (resolve, reject) => (e, r) => e ? reject(e) : resolve(r)

const readFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(readDir, promiseReturner(resolve, reject))
  })
}

const lookup = curry((password, passwords) => {
  return Promise.resolve(pipe(
    toString,
    split(/\n/),
    contains(password),
  )(passwords))
})

const isMatch = match => Promise.resolve(expect(match).toBe(true))

const passIsMatch = pipeP(
  readFile,
  lookup('admin'),
  isMatch
)

test.skip('readFile', (done) => {
  passIsMatch().then(done)
})

const hashThis = (str) => {
  return new Promise((resolve, reject) => {
    pbkdf2(str, 'salt', 1000, 32, 'md4', promiseReturner(resolve, reject))
  })
}
const hashToString = buffer => Promise.resolve(buffer.toString('hex'))
const appendToFile = (appendable) => {
  return new Promise((resolve, reject) => {
    fs.appendFile(readDir, appendable + '\n', promiseReturner(resolve, reject))
  })
}

test.skip('hashThis', (done) => {
  pipeP(
    hashThis,
    hashToString,
    appendToFile
  )('izzy').then(done)
})
