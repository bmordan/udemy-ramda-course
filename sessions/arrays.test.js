/* global test describe */

const {
  findLastIndex,
  construct,
  not,
  pipe,
  tap,
  map,
  nth,
  __,
  equals,
  curry,
  applyTo,
  traverse
} = require('ramda')

const createBoard = (x, y) => {
  x = x || 6
  y = y || 5
  return new Array(y)
    .fill([])
    .map(row => new Array(x).fill(null))
}

const pickCell = (n) => (row) => nth(n, row)

const Maybe = function (val) {
  this.__val = val
}
Maybe.of = (val) => new Maybe(val)
Maybe.prototype.isNothing = function () {
  return (this.__val === null || this.__val === undefined)
}
Maybe.prototype.map = function (fn) {
  return this.isNothing() ? Maybe.of(null) : Maybe.of(fn(this.__val))
}

describe.skip('And there are arrays', () => {
  test('createBoard', () => {
    expect(createBoard(6, 5).length).toBe(5)
    expect(createBoard(6, 5)[0].length).toBe(6)
  })

  test('Find empty cell in column', () => {
    const board = createBoard(6, 5)
    board[4][4] = 'Not empty'
    /*
      [ [ null, null, null, null, null, null ],
        [ null, null, null, null, null, null ],
        [ null, null, null, null, null, null ],
        [ null, null, null, null, null, null ],
        [ null, null, null, null, 'Not empty', null ] ]
    */
    const col = pickCell(4)
    const rows = map(col, board)
    const index = findLastIndex(equals(null), rows)
    expect(index).toBe(3)
  })

  test('Full columns', () => {
    const board = createBoard(6, 5)
    board[0][4] = 'Not empty'
    board[1][4] = 'Not empty'
    board[2][4] = 'Not empty'
    board[3][4] = 'Not empty'
    board[4][4] = 'Not empty'
    /*
      [ [ null, null, null, null, 'Not empty', null ],
        [ null, null, null, null, 'Not empty', null ],
        [ null, null, null, null, 'Not empty', null ],
        [ null, null, null, null, 'Not empty', null ],
        [ null, null, null, null, 'Not empty', null ] ]
    */
    const col = pickCell(4)
    const rows = map(col, board)
    const index = findLastIndex(equals(null), rows)
    expect(index).toBe(-1)
  })

  test('placement function', () => {
    const targetCol = 4
    const board = createBoard(6, 5)
    board[3][4] = 'Not empty'
    board[4][4] = 'Not empty'
    const rows = curry((board, fn) => map(fn, board))
    const findEmptyRowIndex = pipe(
      pickCell,
      rows(board),
      findLastIndex(equals(null))
    )
    expect(findEmptyRowIndex(targetCol)).toBe(2)
    board[findEmptyRowIndex(targetCol)][targetCol] = 'Counter'
    expect(board[2][4]).toEqual('Counter')
  })

  test('find adjacent cells', () => {
    const board = createBoard(3, 3)
    board[0][1] = 'y+1'
    board[1][1] = 'target'
    board[2][1] = 'y-1'
    /*
    [ [ null, 'y+1', null ],
      [ null, 'target', null ],
      [ null, 'y-1', null ] ]
    */

    const isNull = Maybe.of(null)
    expect(isNull.isNothing()).toBe(true)
    const isNotNull = Maybe.of(board)
    expect(isNotNull.isNothing()).toBe(false)

    const scan = (board) => {
      return Maybe.of(board)
        .map(testRow)
        .map(mapRows)
    }

    const testRow = (row) => {
      return row.some(cell => {
        return !!cell
      })
    }

    const mapRows = (rows) => {
      console.log({rows})
    }
    scan(board)
  })
})
