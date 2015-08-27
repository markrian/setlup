import chai from 'chai';
import Example from '../../app/app';

let expect = chai.expect

describe('dummy', () => {
  it('works at all', () => {
    expect(true).to.be.true;
  });

  it('works at all', () => {
    expect(1).to.equal(1);
  });

  it('imports as I expect it to', () => {
    var example = new Example();
    var value = {};
    expect(example.run(value)).to.equal(value);
  });

  it('imports as I expect it to', () => {
    var example = new Example();
    expect(example.add(1, 2)).to.equal(3);
  });

});
