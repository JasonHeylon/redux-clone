type Reducer<T> = (prevState: T, action: IAction) => T;

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
  let currentReducer: Reducer<T> = reducer;

  const getState = (): T | {} => {
    return state;
  };

  const dispatch = (action: IAction): void => {
    const newState = currentReducer(state, action);
    state = newState;

    subscribers.forEach((subscriber) => subscriber());
  };

  const subscribe = (listener: Function): Function => {
    if (subscribers.indexOf(listener) < 0) subscribers.push(listener);

    return (): void => {
      subscribers.splice(subscribers.indexOf(listener), 1);
    };
  };

  const replaceReducer = (newReducer: Reducer<T>): void => {
    currentReducer = newReducer;
  };

  let store = {
    getState,
    dispatch,
    subscribe,
    replaceReducer,
  };

  if (enhancer) {
    store = enhancer(store);
  }

  return store;
}

export function combineReducers<T>(reducers: { [key: string]: Reducer<T> }): Reducer<T> {
  return (state: T, action: IAction): T => {
    Object.keys(reducers).forEach((key) => {
      state = {
        ...state,
        [key]: reducers[key](state[key], action),
      };
    });

    return state;
  };
}

export function applyMiddleware<T>(...middlewares: Array<Function>): Function {
  return (store: IStore<T>): IStore<T> => {
    middlewares = middlewares.slice();
    middlewares.reverse();

    let dispatch = store.dispatch;

    middlewares.forEach((middleware) => (dispatch = middleware(store)(dispatch)));

    return { ...store, dispatch: dispatch };
  };
}

export function bindActionCreator(creator: Function, dispatch: Function): Function {
  return (...args: any[]): void => {
    dispatch(creator(...args));
  };
}

export function compose(...storeEnhancer: Array<Function>): Function {
  const enhancers = storeEnhancer.slice();
  enhancers.reverse();

  return (store: any): any => enhancers.reduce((acc, curr) => curr(acc), store);
}
