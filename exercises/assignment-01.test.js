const { __, pipe, tap, prop, props, reduceRight, subtract, reverse, divide } = require('ramda')
const data = {"coord":{"lon":-0.13,"lat":51.51},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"base":"stations","main":{"temp":285.06,"pressure":1014,"humidity":76,"temp_min":284.15,"temp_max":286.15},"visibility":10000,"wind":{"speed":9.3,"deg":240,"gust":15.4},"clouds":{"all":75},"dt":1511178600,"sys":{"type":1,"id":5091,"message":0.0087,"country":"GB","sunrise":1511162879,"sunset":1511193846},"id":2643743,"name":"London","cod":200}

test('extract the day light hours from this data', () => {
  const getDayLightHours = pipe(
    prop('sys'),
    props(['sunrise', 'sunset']),
    reverse,
    reduceRight(subtract, 0),
    divide(__, 60),
    divide(__, 60),
    Math.floor
  )
  expect(getDayLightHours(data)).toBe(8)
})
