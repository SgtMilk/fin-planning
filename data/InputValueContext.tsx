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
import { getNewKey } from "./processingFunctions";

import template from "./exampleInputValues.json";
import { getCurMonth } from "./utils";

export interface InputValue {
  Title: string;
  "Current Value": number;
  "Contribution / Month": number;
  "Start Date": string;
  "End Date": string;
  "Contribution IPY (%)": number;
  "APY (%)": number;
  Type: string;
  "Taxed CG": boolean;
}

export type InputValueKey =
  | "Title"
  | "Current Value"
  | "Contribution / Month"
  | "Start Date"
  | "End Date"
  | "Contribution IPY (%)"
  | "APY (%)"
  | "Taxed CG"
  | "Type";

export const inputValueKeys: InputValueKey[] = [
  "Title",
  "Current Value",
  "Contribution / Month",
  "Start Date",
  "End Date",
  "Contribution IPY (%)",
  "APY (%)",
  "Taxed CG",
  "Type",
];

export interface InputValueStore {
  [key: string]: InputValue;
}

enum ReducerTypes {
  SET_STORE,
  SET_INPUT_VALUES,
  ADD_INPUT_VALUE,
  MODIFY_INPUT_VALUE,
  MODIFY_INFLATION,
  DELETE_INPUT_VALUE,
  EDIT_SECTION_TITLE,
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
    value: string | number | boolean
  ) => void;
  modifyInflation: (oldValue: number, newValue: number) => void;
  deleteInputValue: (id: string) => void;
  editSectionTitle: (oldValue: string, newValue: string) => void;
  getInputValue: (id: string) => InputValue;
  getInputValueKeys: () => Array<string>;
  getInputValueKeysByType: (type: string) => Array<string>;
  getInvestmentInputValueKeys: () => Array<string>;
  getTypes: () => Array<string>;
  state: InputValueStore;
}

const getDefaultInputValue = (type: string) => {
  const curMonth = getCurMonth();
  const emptyInputValue = {
    Title: "New Value",
    "Current Value": 0,
    "Contribution / Month": 0,
    "Start Date": curMonth,
    "End Date": curMonth,
    "Contribution IPY (%)": 4,
    "APY (%)": 0,
    Type: type,
    "Taxed CG": false,
  };
  return emptyInputValue;
};

export const defaultInputValue = getDefaultInputValue("No Type");

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

    case ReducerTypes.MODIFY_INFLATION:
      const { oldValue, newValue } = action.data;
      for (let key in state) {
        if (state[key]["Contribution IPY (%)"] == oldValue)
          state[key]["Contribution IPY (%)"] = newValue;
      }
      return { ...state };

    case ReducerTypes.DELETE_INPUT_VALUE:
      if (action.data in state) {
        const { [action.data]: _, ...rest } = state;
        return rest;
      }
      return state;

    case ReducerTypes.EDIT_SECTION_TITLE:
      for (let key in state) {
        if (state[key].Type === action.data.oldValue)
          state[key].Type = action.data.newValue;
      }
      return { ...state };

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
      dispatch({
        type: ReducerTypes.ADD_INPUT_VALUE,
        data: getDefaultInputValue(type),
      });
    },

    deleteInputValue: (id: string) =>
      dispatch({ type: ReducerTypes.DELETE_INPUT_VALUE, data: id }),

    editSectionTitle: (oldValue: string, newValue: string) =>
      dispatch({
        type: ReducerTypes.EDIT_SECTION_TITLE,
        data: { oldValue, newValue },
      }),

    modifyInputValue: (
      id: string,
      key: string,
      value: string | number | boolean
    ) =>
      dispatch({
        type: ReducerTypes.MODIFY_INPUT_VALUE,
        data: { id, key, value },
      }),

    modifyInflation: (oldValue: number, newValue: number) => {
      dispatch({
        type: ReducerTypes.MODIFY_INFLATION,
        data: { oldValue, newValue },
      });
    },

    getInputValue: (id: string) => state[id],

    getInputValueKeys: () => Object.keys(state),

    getInputValueKeysByType: (type: string) =>
      Object.entries(state)
        .filter(([_, value]) => value["Type"] == type)
        .map((entry) => entry[0]),

    getInvestmentInputValueKeys: () =>
      Object.entries(state)
        .filter(([_, value]) => value["APY (%)"] !== 0)
        .map((entry) => entry[0]),

    getTypes: () =>
      Object.values(state).reduce(
        (accumulator, curVal) =>
          accumulator.includes(curVal["Type"])
            ? accumulator
            : [...accumulator, curVal["Type"]],
        [] as Array<string>
      ),

    state,
  };

  useEffect(() => {
    // little hack to keep state
    window.onbeforeunload = function () {
      Cookies.set("inputValues", JSON.stringify(state));
    };

    if (!ready) {
      let cookieStringValue = Cookies.get("inputValues");
      if (!cookieStringValue || cookieStringValue === "{}")
        cookieStringValue = JSON.stringify(template);
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
