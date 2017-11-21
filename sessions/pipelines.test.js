/* global test describe */

const R = require('ramda')

describe('pipelining', () => {
  test('you can compose functions together', () => {
    const addFive = (n) => n + 5
    const sqr = (n) => n * n
    // inner most function first - yuck
    expect(addFive(sqr(0))).toBe(5)
    expect(sqr(addFive(0))).toBe(25)
    // compose innermost right to left
    expect(R.compose(addFive, sqr)(0)).toBe(5)
    expect(R.compose(sqr, addFive)(0)).toBe(25)
    // pipe reverses innermost left to right
    expect(R.pipe(sqr, addFive)(0)).toBe(5)
    expect(R.pipe(addFive, sqr)(0)).toBe(25)
  })
})

describe('building pipelines', () => {
  test('odd numbers in a range add upto 9', () => {
    // from (inclusive) to to (exclusive)
    expect(R.range(1, 6)).toEqual([1, 2, 3, 4, 5])

    const isOdd = R.modulo(R.__, 2)
    // __ placeholder as n would be undefined

    expect(isOdd(3)).toBeTruthy()
    expect(isOdd(4)).toBeFalsy()

    const addOdds = R.pipe(
      R.filter(isOdd),
      R.reduce(R.add, 0)
    )

    expect(addOdds(R.range(1, 6))).toBe(9)
  })
})

describe('How many daylight hours?', () => {
  const data = require('../fixtures/weather-data.json')

  const props = ['sunrise', 'sunset']

  const pickTimes = R.pipe(
    R.prop('sys'),
    R.pick(props),
    R.props(props)
  )

  expect(pickTimes(data)).toEqual([1511162879, 1511193846])

  const secondsToHours = R.pipe(
    R.divide(R.__, 60),
    R.divide(R.__, 60),
    Math.floor
  )

  expect(secondsToHours(3600)).toBe(1)

  const calculateHours = R.pipe(
    R.reverse,
    R.reduceRight(R.subtract, 0),
    secondsToHours
  )

  const getDayLightHours = R.pipe(
    pickTimes,
    calculateHours
  )

  expect(getDayLightHours(data)).toEqual(8)
})
