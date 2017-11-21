/* global test describe */

const R = require('ramda')

describe.only('And there are arrays', () => {
  test('transpose', () => {
    const grid = [
      ['hello', 'js', 'Jim'],
      ['world', 'rules', 'Carry']
    ]
    const transposed = [
      ['hello', 'world'],
      ['js', 'rules'],
      ['Jim', 'Carry']
    ]
    expect(R.transpose(grid)).toEqual(transposed)
  })
})
