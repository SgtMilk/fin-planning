import {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useMemo,
} from "react";

export interface InputValue {
  Title: string;
  "Current Value": number;
  "Start Date": string;
  "End Date": string;
  "APY (%)": number;
}

export type InputValueKey =
  | "Title"
  | "Current Value"
  | "Start Date"
  | "End Date"
  | "APY (%)";

export interface InputValueStore {
  [key: string]: InputValue;
}

enum ReducerTypes {
  SET_INPUT_VALUES,
  ADD_INPUT_VALUE,
  MODIFY_INPUT_VALUE,
  DELETE_INPUT_VALUE,
}

interface InputValueAction {
  type: ReducerTypes;
  data: any;
}

interface ContextFunctions {
  setInputValues: (data: Array<InputValue>) => void;
  addInputValue: (data: InputValue) => void;
  modifyInputValue: (
    id: string,
    key: InputValueKey,
    value: string | number
  ) => void;
  deleteInputValue: (id: string) => void;
  getInputValue: (id: string) => InputValue;
  getInputValueKeys: () => Array<string>;
  state: InputValueStore;
}

const InputValueContext = createContext<ContextFunctions>(
  undefined as unknown as ContextFunctions
);

export const useInputValueContext = (): ContextFunctions =>
  useContext(InputValueContext);

const getNewKey = () => Math.random().toString(36).substring(2, 12); // 10 digit key

const InputValuesReducer = (
  state: InputValueStore,
  action: InputValueAction
): InputValueStore => {
  switch (action.type) {
    case ReducerTypes.SET_INPUT_VALUES:
      return action.data.reduce(
        (accumulator: InputValueStore, inputValue: InputValue) => ({
          ...accumulator,
          [getNewKey()]: inputValue,
        }),
        {}
      );

    case ReducerTypes.ADD_INPUT_VALUE:
      return { ...state, [getNewKey()]: action.data };

    case ReducerTypes.MODIFY_INPUT_VALUE:
      const id: string = action.data.id;
      const key: InputValueKey = action.data.key;
      if (id in state && key in state[id]) {
        state[id][key] = action.data.value as never; // little type hack
        return { ...state };
      }
      return state;

    case ReducerTypes.DELETE_INPUT_VALUE:
      if (action.data in state) {
        const { [action.data]: _, ...rest } = state;
        return rest;
      }
      return state;

    default:
      return state;
  }
};

export const InputValueProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(InputValuesReducer, {});

  const inputValueFunctions = {
    setInputValues: (data: Array<InputValue>) =>
      dispatch({ type: ReducerTypes.SET_INPUT_VALUES, data }),

    addInputValue: (data: InputValue) =>
      dispatch({ type: ReducerTypes.ADD_INPUT_VALUE, data }),

    deleteInputValue: (id: string) =>
      dispatch({ type: ReducerTypes.DELETE_INPUT_VALUE, data: id }),

    modifyInputValue: (id: string, key: string, value: string | number) =>
      dispatch({
        type: ReducerTypes.MODIFY_INPUT_VALUE,
        data: { id, key, value },
      }),

    getInputValue: (id: string) => state[id],

    getInputValueKeys: useMemo(() => {
      // reloads on store change
      return () => Object.keys(state);
    }, [state]),

    state,
  };

  return (
    <InputValueContext.Provider value={inputValueFunctions}>
      {children}
    </InputValueContext.Provider>
  );
};
