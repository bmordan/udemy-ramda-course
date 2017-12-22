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
  sort
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

    if (maybe.isNothing()) return maybe
    return Maybe.of(board[rowInd][colInd])
  })

  const updateBoard = curry((board, color, ref) => {
    const [rowInd, colInd] = ref
    const newRow = always(adjust(always({color, ref}), colInd, board[rowInd]))
    return adjust(newRow, rowInd, board)
  })

  const connect = curry((n, ref) => {
    const [rowInd, colInd] = ref
    const transpose = (transFn) => {
      const [rowTrans, colTrans] = transFn
      return [rowTrans(rowInd), colTrans(colInd)]
    }
    return map(transpose, [
      [subtract(__, n), identity], // up
      [add(n), identity], // down
      [identity, subtract(__, n)], // left
      [identity, add(n)], // right
      [add(n), add(n)], // down right
      [subtract(__, n), subtract(__, n)], // up left
      [subtract(__, n), add(n)], // up right
      [add(n), subtract(__, n)]  // down right
    ])
  })

  const isRed = propEq('color', 'red')
  const isYellow = propEq('color', 'yellow')
  const onlyReds = filter(isRed)
  const onlyYellows = filter(isYellow)

  const connectN = (n) => {
    return pipe(
      connect(n),
      map(maybeCounter(last(turn))),
      reject(maybe => maybe.isNothing()),
      map(maybe => maybe._val),
      onlyReds,
      map(prop('ref'))
    )
  }

  const findCounters = (ref) => {
    const connect1 = connectN(1)(ref)
    const connect2 = connectN(2)(ref)
    const connect3 = connectN(3)(ref)
    const results = insert(0, ref, concat(connect1, connect2, connect3))
    const byColInd = ascend(last)
    return sort(byColInd, results)
  }

  const takeTurn = (color, col) => {
    const board = last(turn)
    const ref = findEmpty(board, col)
    const play = updateBoard(board, color)
    const nextBoard = play(ref)
    turn.push(nextBoard)
    const isWin = findCounters(ref)
  }


  const renderRow = (row) => {
    return map(c => isNil(c) ? ' ' : c.color[0], row)
  }

  const renderBoard = (board) => {
    return map(renderRow, board)
  }

  takeTurn('red', 3)
  takeTurn('yellow', 3)
  takeTurn('red', 2)
  takeTurn('yellow', 3)
  takeTurn('red', 3)
  takeTurn('yellow', 2)
  takeTurn('red', 4)
  takeTurn('yellow', 4)
  takeTurn('red', 5)

  console.log(renderBoard(last(turn)))
  expect(maybeCounter(last(turn), [12, 39]) instanceof Maybe ).toBe(true)

  maybeCounter(last(turn), [4, 2]).map(({ ref }) => expect(ref).toEqual([4, 2]))
  expect(connect(1)([0, 0])).toEqual([
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [1, 1],
    [-1, -1],
    [-1, 1],
    [1, -1]
  ])
  expect(findCounters([4, 2])).toEqual([
    [4, 1],
    [4, 2],
    [4, 3],
    [4, 4]
  ])
})
