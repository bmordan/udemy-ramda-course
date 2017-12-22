test.only('add 2 + 3', () => {
  function add (a) {
    return function (b) {
      return a + b
    }
  }
  const add2 = add(2)
  expect(typeof add2).toBe('function')
  expect(add2(3)).toBe(5)
})
