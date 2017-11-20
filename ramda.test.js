/* global test */

const R = require('ramda')
const http = require('request-promise')
const apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=London&APPID=0e84fff59c78cc63e30efd44a630f28b'



describe('adding some spice by curring', () => {
  test('uncurried functions', () => {
    const addThree = (a, b, c) => a + b + c
    expect(addThree(1, 1)).toBeFalsy()
    // In JavaScript, there are six falsy values: false, 0, '', null, undefined, and NaN. Everything else is truthy
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

describe('Using placeholders', () => {
  const placeholderExample = R.replace('{name}', R.__, 'Hi {name}')
  expect(placeholderExample('Bernard')).toBe('Hi Bernard')
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
  const data = JSON.parse('{"coord":{"lon":-0.13,"lat":51.51},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"base":"stations","main":{"temp":285.06,"pressure":1014,"humidity":76,"temp_min":284.15,"temp_max":286.15},"visibility":10000,"wind":{"speed":9.3,"deg":240,"gust":15.4},"clouds":{"all":75},"dt":1511178600,"sys":{"type":1,"id":5091,"message":0.0087,"country":"GB","sunrise":1511162879,"sunset":1511193846},"id":2643743,"name":"London","cod":200}')

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
