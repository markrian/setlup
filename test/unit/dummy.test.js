import chai from 'chai';
let assert = chai.assert

import Example from '../../app/app';
import { integers } from '../../app/app';


describe('dummy', () => {
  it('works at all', () => {
    assert.strictEqual(true, true);
  });

  it('imports as I expect it to', () => {
    var example = new Example();
    var value = {};
    assert.strictEqual(example.run(value), value);
  });

  it('imports as I expect it to', () => {
    var example = new Example();
    assert.strictEqual(example.add(1, 2), 3);
  });

  it('imports as I expect it to', () => {
    var example = new Example();
    assert.deepEqual(example.args(), [1,'test',[]]);
  });

  it('imports as I expect it to', () => {
    let values = [];
    let expected = [0,1,2,3,4]
    for (let i of integers(5)) {
      values.push(i);
    }
    assert.deepEqual(values, expected);
  });

});
