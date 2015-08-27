import chai from 'chai';
let expect = chai.expect

import Example from '../../app/app';
import { integers } from '../../app/app';


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

  it('imports as I expect it to', () => {
    var example = new Example();
    expect(example.args()).to.deep.equal([1,'test',[]]);
  });

  it('imports as I expect it to', () => {
    let values = [];
    let expected = [0,1,2,3,4]
    for (let i of integers(5)) {
      values.push(i);
    }
    expect(values).to.deep.equal(expected);
  });

});
