/* global test describe */

const R = require('ramda')

test('Using placeholders', () => {
  const placeholderExample = R.replace('{name}', R.__, 'Hi {name}')
  expect(placeholderExample('Bernard')).toBe('Hi Bernard')
})
