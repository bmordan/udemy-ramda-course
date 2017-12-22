const {
  reverse,
  adjust,
  always,
  pipe,
  last
} = require('ramda')

test('arrays are mutable', () => {
  const a = [1,2,3,4]
  const b = a.reverse() // [4,3,2,1]

  expect(a[0]).toBe(1)
  expect(b[0]).toBe(4)
})

test.only('arrays are mutable', () => {
  const a = [1,2,3,4]
  const b = a

  const updateB = pipe(
    adjust(always(2), 3), last
  )

  expect(a[3]).toBe(4)
  expect(updateB(b)).toBe(2)
})
