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
  subscribe: (listener: Function) => Function;
  replaceReducer: (nextReducer: Reducer) => void;
}

export function createStore<T>(reducer: Reducer<T>, preloadState?: T, enhancer?: any): IStore<T> {
  let state: T = preloadState ? { ...preloadState } : {};
  const subscribers: Array<Function> = [];
  let currentReducer = reducer;

  return {
    getState(): T | {} {
      return state;
    },
    dispatch(action): void {
      const newState = currentReducer(state, action);
      state = newState;
      subscribers.forEach((subscriber) => subscriber());
    },
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
}

// export function combinReducers(reducers: ReducerList) {

// }
