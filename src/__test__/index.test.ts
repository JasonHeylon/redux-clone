import { createStore } from '..';
import { emptyReducer } from './utils/fixture';

describe('createStore', () => {
  it('should get initialState', () => {
    const store = createStore(emptyReducer, { counter: 0 });
    expect(store.getState()).toEqual({ counter: 0 });
  });

  it('should get {} without initialState', () => {
    const store = createStore(emptyReducer);
    expect(store.getState()).toEqual({});
  });
});

describe('dispatch and subscribe', () => {
  const reducer = (preveState, action) => {
    if (action.type === 'INCREMENT') {
      return { ...preveState, counter: preveState.counter + 1 };
    }
  };
  it('should change State', () => {
    const store = createStore(reducer, { counter: 0 });
    expect(store.getState()).toEqual({ counter: 0 });
    store.dispatch({ type: 'INCREMENT' });

    expect(store.getState()).toEqual({ counter: 1 });
  });

  it('should run subscribe after dispatch', () => {
    const store = createStore(reducer, { counter: 0 });
    const subscriber = jest.fn();
    store.subscribe(subscriber);

    store.dispatch({ type: 'INCREMENT' });
    expect(subscriber.mock.calls.length).toBe(1);

    store.dispatch({ type: 'INCREMENT' });
    expect(subscriber.mock.calls.length).toBe(2);
  });
});
