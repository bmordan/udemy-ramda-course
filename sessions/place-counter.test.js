const {
  __,
  pipe,
  curry,
  isNil,
  findLastIndex,
  tap,
  map,
  adjust,
  unnest,
  splitEvery,
  dec,
  takeWhile,
  range,
  always,
  identity,
  nth,
  prop,
  difference,
  filter,
  has,
  not,
  complement,
  propEq,
  head,
  last,
  traverse,
  compose,
  partial,
  xprod,
  inc,
  transduce,
  reduceWhile,
  join,
  ifElse,
  aperture,
  reduce,
  subtract,
  add,
  reject,
  concat,
  flatten,
  insert,
  ascend,
  sort,
  until,
  evolve,
  path,
  when,
  unless,
  of,
  gt,
  lt,
  gte,
  lte,
  length,
  converge,
  equals
} = require('ramda')
const Maybe = require('../fixtures/maybe')

const Board = curry(function (rows, cols) {
  return new Array(rows).fill(new Array(cols).fill(null))
})

test('there is a board', () => {
  const board = Board(5, 6)
  expect(board.length).toBe(5)
  expect(board[0].length).toBe(6)
})

test('you can drop a counter into a col', () => {
  const board = Board(5)(6)

  const addCounterToCol = (col) => {
    const colInd = dec(col)
    const rowInd = pipe(
      map(nth(col)),
      findLastIndex(isNil)
    )(board)
    const createCounter = always({color: 'red', ref: [rowInd, colInd]})
    const newRow = always(adjust(createCounter, colInd, board[rowInd]))
    return adjust(newRow, rowInd, board)
  }

  const updatedBoard = addCounterToCol(3)
  expect(updatedBoard[4][2]).toBeTruthy()
})

test('you can keep dropping a counter into a col', () => {
  const addCounterTo = curry((board, col, color) => {
    const colInd = dec(col)
    const rowInd = pipe(
      map(nth(colInd)),
      findLastIndex(isNil)
    )(board)
    const createCounter = always({color, ref: [rowInd, colInd]})
    const newRow = always(adjust(createCounter, colInd, board[rowInd]))
    return adjust(newRow, rowInd, board)
  })
  const turn0 = Board(5)(6)
  const turn1 = addCounterTo(turn0, 3, 'red')
  const turn2 = addCounterTo(turn1, 3, 'yellow')
  expect(prop('color', turn1[4][2])).toBe('red')
  expect(prop('color', turn2[3][2])).toBe('yellow')
})

test('you can check the cells around you', () => {
  let turn = [Board(5)(6)]

  const findEmpty = curry((board, col) => {
    const colInd = dec(col)
    const rowInd = pipe(
      map(nth(colInd)),
      findLastIndex(isNil)
    )(board)
    return [rowInd, colInd]
  })

  const maybeCounter = curry((board, [rowInd, colInd]) => {
    const maybe = Maybe.of(board[rowInd])
    return maybe.isNothing()
      ? maybe
      : Maybe.of(board[rowInd][colInd])
  })

  const updateBoard = curry((board, color, ref) => {
    const [rowInd, colInd] = ref
    const newRow = always(
      adjust(always({color, ref}), colInd, board[rowInd])
    )
    return adjust(newRow, rowInd, board)
  })

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
  const connect4 = (connections) => gt(4, length(connections))
  const maybeRef = path(['_val', 'ref'])
  const maybeColor = path(['_val', 'color'])

  const findConnectionsFor = (color, ref) => {
    const maybeFor = maybeCounter(last(turn))

    const fn = (connections, transformFn) => {
      const tryConnect4 = reduce((acc, transFn) => {
        function tryConnect (acc, ref) {
          const maybe = maybeFor(ref)
          if (maybe.isNothing()) return acc
          const rightColor = equals(maybeColor(maybe), color)
          if (not(rightColor)) return acc
          const nextRef = transFn(maybeRef(maybe))
          const nextAcc = concat(acc, of(maybeRef(maybe)))
          return tryConnect(nextAcc, nextRef)
        }
        const foundConnections = tryConnect(acc, transFn(ref))
        return connect4(foundConnections) ? connections : foundConnections
      }, connections, transformFn)
      return tryConnect4
    }

    return reduceWhile(connect4, fn, [ref], transformFns)
  }

  const takeTurn = (color, col) => {
    const board = last(turn)
    const ref = findEmpty(board, col)
    const play = updateBoard(board, color)
    const nextBoard = play(ref)
    turn.push(nextBoard)
  }


  const renderRow = (row) => {
    return map(c => isNil(c) ? ' ' : c.color[0], row)
  }

  const renderBoard = (board) => {
    return map(renderRow, board)
  }

  takeTurn('yellow', 3)
  takeTurn('yellow', 3)
  takeTurn('yellow', 2)
  takeTurn('yellow', 2)
  takeTurn('yellow', 2)
  takeTurn('yellow', 4)
  takeTurn('yellow', 4)
  takeTurn('red', 1)
  takeTurn('red', 1)
  takeTurn('red', 1)
  takeTurn('red', 3)
  takeTurn('red', 3)
  takeTurn('red', 5)
  takeTurn('red', 5)
  takeTurn('red', 5)
  takeTurn('red', 5)

  expect(maybeCounter(last(turn), [12, 39]) instanceof Maybe ).toBe(true)
  maybeCounter(last(turn), [4, 2]).map(({ ref }) => expect(ref).toEqual([4, 2]))
  expect(findConnectionsFor('red', [1, 4])).toEqual([
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4]
  ])
  expect(findConnectionsFor('yellow', [3, 3])).toEqual([[3, 3]])
  expect(connect4([1, 2])).toBe(true)
  expect(connect4([1, 2, 3, 4])).toBe(false)

  takeTurn('yellow', 1)

  expect(findConnectionsFor('yellow', [1, 0])).toEqual([
    [1, 0],
    [2, 1],
    [3, 2],
    [4, 3]
  ])

  console.log(renderBoard(last(turn)))
})
