const {
  add,
  partial,
  partialRight,
  __
} = require('ramda')

test.only('partials', () => {
  expect(add(2, 3)).toBe(5)
  expect(typeof add(2)).toBe('function')

  const add2 = partial(add, [2])
  expect(add2(3)).toBe(5)

  const add3 = partialRight(add, [3])
  expect(add3(2)).toBe(5)

  const add4 = add(__, 4)
  expect(add4(1)).toBe(5)
})
