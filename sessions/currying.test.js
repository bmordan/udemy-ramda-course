/* global test describe */

const R = require('ramda')

describe('adding some spice by curring', () => {
  test('uncurried functions', () => {
    const addThree = (a, b, c) => a + b + c
    expect(addThree(1, 1)).toBeFalsy()
    /*
      In JavaScript, there are six falsy values:

      false
      0
      ''
      null
      undefined
      NaN

      Everything else is truthy
    */
  })
  test('curried functions', () => {
    const addThree = R.curry((a, b, c) => a + b + c)
    expect(addThree(1, 2, 3)).toBe(6)
    expect(addThree(1)(2, 3)).toBe(6)
  })

  test('curry returns functions untill all the aruments have been passed', () => {
    const addThree = R.curry((a, b, c) => a + b + c)
    const addThreeWithOne = addThree(1)
    expect(typeof addThreeWithOne).toBe('function')
    expect(typeof addThreeWithOne(1, 1)).toBe('number')
    expect(addThreeWithOne(1, 1)).toBe(3)
  })
})
