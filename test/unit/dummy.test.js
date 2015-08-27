import assert from 'assert';
import Example from '../../app/app';

describe('dummy', () => {
  it('works at all', () => {
    assert.equal(true, true);
  });

  it('works at all', () => {
    assert.strictEqual(1, 1);
  });

  it('imports as I expect it to', () => {
    var example = new Example();
    var value = {};
    assert.strictEqual(example.run(value), value);
  });

  it('imports as I expect it to', () => {
    var example = new Example();
    assert.equal(example.add(1, 2), 3);
  });

});
