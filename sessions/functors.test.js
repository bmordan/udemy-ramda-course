const {
  add
} = require('ramda')

const add3 = add(3)

test('A Functor has a map', () => {
  expect([2].map(add3)).toEqual([5])
  expect([].map(add3)).toEqual([])
})

test('Apply takes a wrapped function', () => {
  const wrappedValue = [2]
  const wrappedFn = [add3]
  Array.prototype.ap = function (wrappedFn) {
    return wrappedFn.map(fn => fn(this[0]))
  }
  expect(wrappedValue.ap(wrappedFn)).toEqual([5])
})

test('Apply has an ap', () => {
  expect([2] + [3]).not.toBe([5])
  expect([2] + [3]).toBe("23") // javascript!!

  Array.prototype.ap = function (array) {
    return !this[0] ? [] : array.map(add(this[0]))
  }

  expect([2].ap([3])).toEqual([5])
  expect([].ap([3])).toEqual([])
})

test('Applicative has an of', () => {
  Array.prototype.of = function (val) {
    return new Array(1).fill(val)
  }

  expect([].of(2)).toEqual([2])
})

test('Chain gives us a chain', () => {
  Array.prototype.nothing = function () {
    return !this[0]
  }

  Array.prototype.just = function () {
    return this[0]
  }

  Array.prototype.chain = function (fn) {
    return !this.map(fn)[0] ? this : this.map(fn)
  }
  expect([3]
    .chain(add3)
    .chain(add3)
    .chain(add3)
  ).toEqual([12])
})

test('Maybes are unbreakable', () => {
  const unbrokenChain = [3]
    .chain(add3)
    .chain(() => undefined)
    .chain(add3)

  expect([].nothing()).toBe(true)
  expect([2].nothing()).toBe(false)
  expect([2].just()).toBe(2)
  expect(unbrokenChain).toEqual([9])
})

test('Just and Nothing', () => {
  const value3 = [].of(3)
  const nonValue = [].of(undefined)

  expect(value3.just()).toBe(3)
  expect(nonValue.nothing()).toBe(true)
})
