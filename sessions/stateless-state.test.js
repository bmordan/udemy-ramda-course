const {
  adjust,
  map,
  nth,
  findLastIndex,
  pipe,
  tap,
  isNil,
  update
} = require('ramda')

describe.skip('statelessness tests', () => {
  const Grid = (rows, cols) => {
    return new Array(rows)
      .fill(
        new Array(cols)
          .fill(null)
      )
  }

  const addCounterToGrid = (grid, col, counter) => {
    const row = pipe(
      map(nth(col)),
      findLastIndex(isNil)
    )(grid)
    return adjust(update(col, counter), row, grid)
  }

  test('create an empty 3x3 grid', () => {
    expect(Grid(6, 7)).toEqual([
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ])
  })

  test('you can add a counter to the grid', () => {
    const grid = Grid(3, 3)

    expect(addCounterToGrid(grid, 1, "O")).toEqual([
      [null, null, null],
      [null, null, null],
      [null, "O", null]
    ])
  })

  test('you can add a few counters to the grid', () => {
    const grid1 = Grid(3, 3)
    const grid2 = addCounterToGrid(grid1, 1, "X")
    const grid3 = addCounterToGrid(grid2, 1, "O")

    expect(grid3).toEqual([
      [null, null, null],
      [null, "O", null],
      [null, "X", null]
    ])
  })
})
