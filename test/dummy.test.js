describe('dummy', function () {
  var Example = require('app');

  it('works at all', function () {
    expect(true).toBe(true);
  });

  it('works at all', function () {
    expect(1).toBe(1);
  });

  it('imports as I expect it to', function () {
    var example = new Example();
    var value = {};
    expect(example.run(value)).toBe(value);
  });

  it('imports as I expect it to', function () {
    var example = new Example();
    expect(example.add(1, 2)).toBe(3);
  });

});
