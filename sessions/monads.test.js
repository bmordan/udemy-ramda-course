const {
  adjust,
  map,
  nth,
  findLastIndex,
  pipe,
  tap,
  isNil,
  update,
  difference,
  dec,
  inc
} = require('ramda')

const Grid = (rows, cols) => {
  return new Array(rows).fill(
    new Array(cols).fill(null)
  )
}

const addCounterToGrid = (grid, col, counter) => {
  const row = pipe(
    map(nth(col)),
    findLastIndex(isNil)
  )(grid)
  return adjust(update(col, counter), row, grid)
}

const grid1 = Grid(6, 6)
const grid2  = addCounterToGrid(grid1, 1,  " O")
const grid3  = addCounterToGrid(grid2, 1,  " X")
const grid4  = addCounterToGrid(grid3, 5,  " O")
const grid5  = addCounterToGrid(grid4, 4,  " X")
const grid6  = addCounterToGrid(grid5, 4,  " O")
const grid7  = addCounterToGrid(grid6, 3,  " X")
const grid8  = addCounterToGrid(grid7, 3,  " O")
const grid9  = addCounterToGrid(grid8, 0,  " X")
const grid10 = addCounterToGrid(grid9, 2,  " O")
const grid11 = addCounterToGrid(grid10, 2, " X")
const grid12 = addCounterToGrid(grid11, 5, " O")
const grid13 = addCounterToGrid(grid12, 0, " X")
const grid14 = addCounterToGrid(grid13, 5, " O")
const grid15 = addCounterToGrid(grid14, 2, " X")
const grid16 = addCounterToGrid(grid15, 5, " O")

function Maybe (val) {
  this._val = val
}
Maybe.of = (val) => {
  new Maybe(val)
}
Maybe.prototype.isNothing = () => {
  return (this)
}

const up = adjust(dec, 0)
const down = adjust(inc, 0)
const left = adjust(dec, 1)
const right = adjust(inc, 1)
const upLeft = pipe(adjust(dec, 0), adjust(dec, 1))
const downRight = pipe(adjust(inc, 0), adjust(inc, 1))
const upRight = pipe(adjust(dec, 0), adjust(inc, 1))
const downLeft = pipe(adjust(inc, 0), adjust(dec, 1))
const transformFns = [
  [up, down],
  [left, right],
  [upLeft, downRight],
  [upRight, downLeft]
]

const connect4 = (grid, lastPlay) => {
  const [row, col] = lastPlay
  return [lastPlay]
}

test('can transform a tuple', () => {
  const trans = down([2, 5])
  expect(trans).toEqual([3, 5])
  expect(grid16[trans[0]][trans[1]]).toEqual(" O")
  expect(() => grid16[6][5]).toThrow()
})

test.skip('find 4 connected counters', () => {
  expect(connect4(grid16, [2, 5])).toEqual([
    [2, 5],
    [3, 5],
    [4, 5],
    [5, 5]
  ])
})
