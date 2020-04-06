type Reducer<T> = (prevState: T, action: IAction) => T;
type ReducerList = {
  [namespace: string]: Reducer<any>;
};
interface IAction {
  type: string;
  payload?: any;
}

interface IStore<T> {
  getState: () => T | {};
  dispatch: (action: IAction) => void;
  subscribe: (listener: Function) => void;
  // replaceReducer: (nextReducer: Reducer) => void;
}

export function createStore<T>(reducer: Reducer<T>, preloadState?: T, enhancer?: any): IStore<T> {
  let state: T = preloadState ? { ...preloadState } : {};
  const subscribers: Array<Function> = [];

  return {
    getState(): T | {} {
      return state;
    },
    dispatch(action): void {
      const newState = reducer(state, action);
      state = newState;
      subscribers.forEach((subscriber) => subscriber());
    },
    subscribe(listener): void {
      if (subscribers.indexOf(listener) < 0) subscribers.push(listener);
    },
  };
}

// export function combinReducers(reducers: ReducerList) {

// }
