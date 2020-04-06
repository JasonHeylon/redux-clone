import { createStore, combineReducers } from '..';
import { emptyReducer } from './utils/fixture';

const INCREMENT_ACTION_TYPE = 'INCREMENT';

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
    if (action.type === INCREMENT_ACTION_TYPE) {
      return { ...preveState, counter: preveState.counter + 1 };
    }
  };
  it('should change State', () => {
    const store = createStore(reducer, { counter: 0 });
    expect(store.getState()).toEqual({ counter: 0 });
    store.dispatch({ type: INCREMENT_ACTION_TYPE });

    expect(store.getState()).toEqual({ counter: 1 });
  });

  it('should run subscribe after dispatch', () => {
    const store = createStore(reducer, { counter: 0 });
    const subscriber = jest.fn();
    store.subscribe(subscriber);

    store.dispatch({ type: INCREMENT_ACTION_TYPE });
    expect(subscriber.mock.calls.length).toBe(1);

    store.dispatch({ type: INCREMENT_ACTION_TYPE });
    expect(subscriber.mock.calls.length).toBe(2);
  });

  it('should return unscribe function when call subscribe', () => {
    const store = createStore(reducer, { counter: 0 });
    const subscriber = jest.fn();
    const unscribe = store.subscribe(subscriber);

    store.dispatch({ type: INCREMENT_ACTION_TYPE });
    expect(subscriber.mock.calls.length).toBe(1);

    unscribe();

    store.dispatch({ type: INCREMENT_ACTION_TYPE });
    expect(subscriber.mock.calls.length).toBe(1);
  });

  it('should use new reducer after call replace reducer', () => {
    const originalReducer = jest.fn().mockImplementation((state) => state);
    const store = createStore(originalReducer, { counter: 0 });

    const newRedcuer = jest.fn().mockImplementation((...args) => {
      return reducer(...args);
    });

    store.dispatch({ type: INCREMENT_ACTION_TYPE });
    expect(store.getState()).toEqual({ counter: 0 });
    expect(originalReducer.mock.calls.length).toEqual(1);
    store.replaceReducer(newRedcuer);

    store.dispatch({ type: INCREMENT_ACTION_TYPE });
    expect(originalReducer.mock.calls.length).toEqual(1);
    expect(store.getState()).toEqual({ counter: 1 });
    expect(newRedcuer.mock.calls.length).toEqual(1);
  });
});

const APPLE_INCREMENT_ACTION_TYPE = 'APPLE_INCREMENT';
const BANANA_INCREMENT_ACTION_TYPE = 'BANANA_INCREMENT';

describe('combineReducers', () => {
  const appleReducer = (state, action) => {
    if (action.type === APPLE_INCREMENT_ACTION_TYPE) {
      return { ...state, counter: state.counter + 1 };
    }
    return state;
  };

  const bananaReducer = (state, action) => {
    if (action.type === BANANA_INCREMENT_ACTION_TYPE) {
      return { ...state, counter: state.counter + 1 };
    }
    return state;
  };

  it('should combine reducers', () => {
    const combindReducers = combineReducers({
      apple: appleReducer,
      banana: bananaReducer,
    });

    const initialState = {
      apple: { counter: 0 },
      banana: { counter: 0 },
    };

    const store = createStore(combindReducers, initialState);

    expect(store.getState()).toEqual(initialState);

    store.dispatch({ type: BANANA_INCREMENT_ACTION_TYPE });

    expect(store.getState()).toEqual({ apple: { counter: 0 }, banana: { counter: 1 } });
    store.dispatch({ type: APPLE_INCREMENT_ACTION_TYPE });

    expect(store.getState()).toEqual({ apple: { counter: 1 }, banana: { counter: 1 } });
  });
});
