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
  const state = preloadState ? { ...preloadState } : {};

  return {
    getState(): T | {} {
      return state;
    },
    dispatch(action) {},
    subscribe(listener) {},
  };
}

// export function combinReducers(reducers: ReducerList) {

// }
