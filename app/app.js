export default class Example {
  run(value) {
    return value;
  }

  add(a, b) {
    return a + b;
  }

  args(a=1, b='test', ...rest) {
    return [a, b, rest];
  }
}

export function* integers(max) {
  var i = 0;
  while (i < max) yield i++;
}
