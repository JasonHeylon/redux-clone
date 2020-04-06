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

export function createStore<T>(reducer: Reducer<T>, preloadState?: T): IStore<T> {
  let state: T = preloadState ? { ...preloadState } : ({} as T);
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
