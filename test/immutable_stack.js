'use strict';

var Stack = require('../lib/immutable_stack')
  , chai = require('chai')
  , expect = chai.expect
  , assert = chai.assert;

describe('The immutable stack', function () {

  var stack;

  beforeEach(function() {
    stack = new Stack();
  });

  it('is initially empty', function() {
    expect(stack.array()).to.deep.equal([]);
    expect(stack.isEmpty());
  });

  it('can push', function() {
    stack = stack.push('thing');
    expect(stack.array()).to.deep.equal(['thing']);
  });

  it('is immutable on push', function() {
    var stack2 = stack.push('thing');
    expect(stack.array()).to.deep.equal([]);
    expect(stack2.array()).to.deep.equal(['thing']);
  });

  it('can\'t peek on empty stack', function() {
    try {
      stack.peek();
      assert.fail();
    } catch (e) {
      expect(e.message).to.equal('can\'t peek on empty stack');
    }
  });

  it('can peek', function() {
    stack = stack.push('head');
    expect(stack.peek()).to.equal('head');
  });

  it('can pop', function() {
    stack = stack.push('thing');
    expect(stack.array()).to.deep.equal(['thing']);
    stack = stack.pop();
    expect(stack.array()).to.deep.equal([]);
  });

  it('is immutable on pop', function() {
    stack = stack.push('thing');
    var stack2 = stack.pop();
    expect(stack.array()).to.deep.equal(['thing']);
    expect(stack2.array()).to.deep.equal([]);
  });
});
