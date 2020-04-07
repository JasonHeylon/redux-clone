type Reducer<T> = (prevState: T, action: IAction) => T;
// type ReducerList = {
//   [namespace: string]: Reducer<any>;
// };
interface IAction {
  type: string;
  payload?: any;
}

interface IStore<T> {
  getState: () => T | {};
  dispatch: (action: IAction) => void;
  subscribe: (listener: Function) => Function;
  replaceReducer: (nextReducer: Reducer<T>) => void;
}

export function createStore<T>(reducer: Reducer<T>, preloadState?: T, enhancer?: Function): IStore<T> {
  let state: T = preloadState ? { ...preloadState } : ({} as T);
  const subscribers: Array<Function> = [];
  let currentReducer = reducer;

  const getState = (): T | {} => {
    return state;
  };

  const dispatch = (action): void => {
    const newState = currentReducer(state, action);
    state = newState;

    subscribers.forEach((subscriber) => subscriber());
  };

  let store = {
    getState,
    dispatch,
    subscribe(listener): Function {
      if (subscribers.indexOf(listener) < 0) subscribers.push(listener);

      return (): void => {
        subscribers.splice(subscribers.indexOf(this.subscribe), 1);
      };
    },
    replaceReducer(newReducer: Reducer<T>): void {
      currentReducer = newReducer;
    },
  };
  if (enhancer) {
    store = enhancer(store);
  }

  return store;
}

export function combineReducers(reducers: ReducerList): Reducer {
  return (state, action) => {
    Object.keys(reducers).forEach((key) => {
      state = {
        ...state,
        [key]: reducers[key](state[key], action),
      };
    });
    return state;
  };
}

export function applyMiddleware(...middlewares): Function {
  return (store) => {
    middlewares = middlewares.slice();
    middlewares.reverse();
    let dispatch = store.dispatch;

    middlewares.forEach((middleware) => (dispatch = middleware(store)(dispatch)));

    return { ...store, dispatch: dispatch };
  };
}

export function bindActionCreator(creator, dispatch): Function {
  return (...args: any[]): void => {
    dispatch(creator(...args));
  };
}
