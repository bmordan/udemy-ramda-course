function Maybe (val) {
	this._val = val
}

Maybe.of = (val) => new Maybe(val)

Maybe.prototype.isNothing = function () {
	return (this._val === null || this._val === undefined)
}

Maybe.prototype.map = function (fn) {
	return this.isNothing() ? Maybe.of(null) : Maybe.of(fn(this._val))
}

module.exports = Maybe
