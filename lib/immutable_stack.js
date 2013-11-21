'use strict';

function ImmutableStack() {
  if (arguments.length >= 1) {
    this._array = arguments[0]
  } else {
    this._array = []
  }
}

ImmutableStack.prototype.array = function() {
  return this._array
}

ImmutableStack.prototype.isEmpty = function(array) {
  return this._array.length === 0
}

ImmutableStack.prototype.push = function(element) {
  var array = this._array.slice(0)
  array.push(element)
  return new ImmutableStack(array)
}

ImmutableStack.prototype.pop = function() {
  var array = this._array.slice(0, this._array.length - 1)
  return new ImmutableStack(array)
}

ImmutableStack.prototype.peek = function() {
  if (this.isEmpty()) {
    throw new Error('can\'t peek on empty stack')
  }
  return this._array[this._array.length - 1]
}

module.exports = ImmutableStack
