import MyLib from './';

describe('test', () => {
  it('ping', () => {
    const lib = new MyLib();
    expect(lib.ping()).toBe('pong');
  });
});
