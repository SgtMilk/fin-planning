"use client";

import {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import {
  BalanceSheet,
  getMonthlyBalanceSheet,
  getNewKey,
} from "./processingFunctions";

export interface InputValue {
  Title: string;
  "Current Value": number;
  "Contribution / Month": number;
  "Start Date": string;
  "End Date": string;
  "Contribution IPY (%)": number;
  "APY (%)": number;
  Type: string;
}

export type InputValueKey =
  | "Title"
  | "Current Value"
  | "Contribution / Month"
  | "Start Date"
  | "End Date"
  | "Contribution IPY (%)"
  | "APY (%)"
  | "Type";

export interface InputValueStore {
  [key: string]: InputValue;
}

enum ReducerTypes {
  SET_STORE,
  SET_INPUT_VALUES,
  ADD_INPUT_VALUE,
  MODIFY_INPUT_VALUE,
  DELETE_INPUT_VALUE,
}

interface InputValueAction {
  type: ReducerTypes;
  data: any;
}

export type FilterFunction = (
  value: [key: string, value: InputValue]
) => boolean;

interface ContextFunctions {
  setInputValues: (data: Array<InputValue>) => void;
  addInputValue: (data: InputValue) => void;
  addEmptyInputValue: (type: string) => void;
  modifyInputValue: (
    id: string,
    key: InputValueKey,
    value: string | number
  ) => void;
  deleteInputValue: (id: string) => void;
  getInputValue: (id: string) => InputValue;
  getInputValueKeys: () => Array<string>;
  getInputValueKeysByType: (type: string) => Array<string>;
  getTypes: () => Array<string>;
  getBalanceSheet: (finalMonth: string) => BalanceSheet;
}

const InputValueContext = createContext<ContextFunctions>(
  undefined as unknown as ContextFunctions
);

export const useInputValueContext = (): ContextFunctions =>
  useContext(InputValueContext);

const InputValuesReducer = (
  state: InputValueStore,
  action: InputValueAction
): InputValueStore => {
  switch (action.type) {
    case ReducerTypes.SET_STORE:
      return action.data;
    case ReducerTypes.SET_INPUT_VALUES:
      return action.data.reduce(
        (accumulator: InputValueStore, inputValue: InputValue) => ({
          ...accumulator,
          [getNewKey()]: inputValue,
        }),
        {}
      );

    case ReducerTypes.ADD_INPUT_VALUE:
      return { [getNewKey()]: action.data, ...state };

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
  const [ready, setReady] = useState<boolean>(false);

  const [state, dispatch] = useReducer(InputValuesReducer, {});

  const inputValueFunctions = {
    setStore: (data: InputValueStore) =>
      dispatch({ type: ReducerTypes.SET_STORE, data }),

    setInputValues: (data: Array<InputValue>) =>
      dispatch({ type: ReducerTypes.SET_INPUT_VALUES, data }),

    addInputValue: (data: InputValue) =>
      dispatch({ type: ReducerTypes.ADD_INPUT_VALUE, data }),

    addEmptyInputValue: (type: string) => {
      const curDate = new Date();
      const curMonth = `${curDate.getFullYear()}-${
        curDate.getMonth() < 10 ? "0" : ""
      }${curDate.getMonth()}`;
      const emptyInputValue = {
        Title: "New Value",
        "Current Value": 0,
        "Contribution / Month": 0,
        "Start Date": curMonth,
        "End Date": curMonth,
        "Contribution IPY (%)": 4,
        "APY (%)": 0,
        Type: type,
      };
      dispatch({ type: ReducerTypes.ADD_INPUT_VALUE, data: emptyInputValue });
    },

    deleteInputValue: (id: string) =>
      dispatch({ type: ReducerTypes.DELETE_INPUT_VALUE, data: id }),

    modifyInputValue: (id: string, key: string, value: string | number) =>
      dispatch({
        type: ReducerTypes.MODIFY_INPUT_VALUE,
        data: { id, key, value },
      }),

    getInputValue: (id: string) => state[id],

    getInputValueKeys: () => Object.keys(state),

    getInputValueKeysByType: (type: string) =>
      Object.entries(state)
        .filter(([_, value]) => value["Type"] == type)
        .map((entry) => entry[0]),

    getTypes: () =>
      Object.values(state).reduce(
        (accumulator, curVal) =>
          accumulator.includes(curVal["Type"])
            ? accumulator
            : [...accumulator, curVal["Type"]],
        [] as Array<string>
      ),
    getBalanceSheet: (finalMonth: string) =>
      getMonthlyBalanceSheet(finalMonth, state),
  };

  useEffect(() => {
    // little hack to keep state
    window.onbeforeunload = function () {
      Cookies.set("inputValues", JSON.stringify(state));
    };

    if (!ready) {
      const cookieStringValue = Cookies.get("inputValues");
      dispatch({
        type: ReducerTypes.SET_STORE,
        data: cookieStringValue ? JSON.parse(cookieStringValue) : {},
      });
      setReady(true);
    }
  });

  return (
    <InputValueContext.Provider value={inputValueFunctions}>
      {children}
    </InputValueContext.Provider>
  );
};
