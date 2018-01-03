const {
  concat,
  __
} = require('ramda')

test('A Maybe', () => {
  const Maybe = function (val) {
    this.val = val
  }

  Maybe.prototype.map = function (fn) {
    this.nothing() ? this : Maybe.of(fn(this.val))
  }

  Maybe.prototype.ap = function (maybe) {
    return maybe.nothing() ? maybe : Maybe.of(maybe.just()(this.val))
  }

  Maybe.of = function (val) {
    return new Maybe(val)
  }

  Maybe.prototype.chain = function (fn) {
    return this.map(fn).nothing() ? this : this.map(fn)
  }

  Maybe.prototype.nothing = function () {
    return !this.val
  }

  Maybe.prototype.just = function () {
    return this.val
  }

  const maybe = Maybe.of("Hi")

  expect(maybe.nothing()).toBe(false)
  expect(maybe.just()).toBe("Hi")

  const maybeFn = Maybe.of(concat(__, " There"))
  const maybeHiThere = maybe.ap(maybeFn)

  expect(maybeHiThere.just()).toBe("Hi There")
})
