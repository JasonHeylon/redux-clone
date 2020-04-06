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

describe('dispatch, subscribe and replaceReducer in store', () => {
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

  it('should return unscribe function when call subscribe', () => {
    const store = createStore(reducer, { counter: 0 });
    const subscriber = jest.fn();
    const unscribe = store.subscribe(subscriber);

    store.dispatch({ type: 'INCREMENT' });
    expect(subscriber.mock.calls.length).toBe(1);

    unscribe();

    store.dispatch({ type: 'INCREMENT' });
    expect(subscriber.mock.calls.length).toBe(1);
  });

  it('should use new reducer after call replace reducer', () => {
    const originalReducer = jest.fn().mockImplementation((state) => state);
    const store = createStore(originalReducer, { counter: 0 });

    const newRedcuer = jest.fn().mockImplementation((...args) => {
      return reducer(...args);
    });

    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toEqual({ counter: 0 });
    expect(originalReducer.mock.calls.length).toEqual(1);
    store.replaceReducer(newRedcuer);

    store.dispatch({ type: 'INCREMENT' });
    expect(originalReducer.mock.calls.length).toEqual(1);
    expect(store.getState()).toEqual({ counter: 1 });
    expect(newRedcuer.mock.calls.length).toEqual(1);
  });
});
