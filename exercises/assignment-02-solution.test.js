const {
  gt,
  reduceWhile,
  partial,
  adjust,
  inc,
  dec,
  pipe,
  map,
  curry,
  append,
  flatten,
  tap,
  splitEvery,
  head,
  last
} = require('ramda')

const connect4 = (arr) => gt(4, arr.length)

const up = adjust(dec, 0)
const down = adjust(inc, 0)
const left = adjust(dec, 1)
const right = adjust(inc, 1)
const upLeft = pipe(adjust(dec, 0), adjust(dec, 1))
const upRight = pipe(adjust(dec, 0), adjust(inc, 1))
const downLeft = pipe(adjust(inc, 0), adjust(dec, 1))
const downRight = pipe(adjust(inc, 0), adjust(inc, 1))

const transFns = [
  [up, down],
  [left, right],
  [downLeft, upRight],
  [upLeft, downRight]
]

const Maybe = function (val) { this.val = val }
Maybe.of = function (val) { return new Maybe(val) }
Maybe.prototype.nothing = function () { return (this.val === null || this.val === undefined) }
Maybe.prototype.just = function () { return this.val }

const maybeCounter = (grid, ref) => {
  const [rowInd, colInd] = ref
  const maybe = Maybe.of(grid[rowInd])
  return maybe.nothing() ? maybe : Maybe.of(grid[rowInd][colInd])
}

const lookup = curry((grid, counter, prevRef, acc, transFn) => {
  const newRef = transFn(prevRef)
  const maybe = maybeCounter(grid, newRef)
  if (maybe.nothing()) return acc
  if (maybe.just() !== counter) return acc
  return lookup(grid, counter, newRef, append(newRef, acc), transFn)
})

const iterator = (grid, counter, lastPlay, transFns) => {
  const found = map(lookup(grid, counter, lastPlay, []), transFns)
  const connections = pipe(
    flatten,
    splitEvery(2)
  )([last(found), lastPlay, head(found)])
  return connect4(connections) ? lastPlay : connections
}

const yourFn = (grid, lastPlay) => {
  const counter = maybeCounter(grid, lastPlay).just()
  return reduceWhile(
    connect4,
    partial(iterator, [grid, counter]),
    lastPlay,
    transFns
  )
}

test('Find connect 4', () => {
  const lastPlay = [3, 5]

  const grid = [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, "®" , null, null, null, null, "®" ],
    ["©" , "©" , null, null, "©" , "®" , "®" ],
    ["®" , "®" , "®" , "©" , "®" , "©" , "©" ],
    ["®" , "©" , "©" , "®" , "©" , "®" , "©" ],
  ]

  const result = [
    [2, 6],
    [3, 5],
    [4, 4],
    [5, 3]
  ]

  expect(yourFn(grid, lastPlay)).toEqual(result)
})
