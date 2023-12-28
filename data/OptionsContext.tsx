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
import { useInputValueContext } from ".";
import { getCurMonth } from "./utils";

export type Option = any;

export type OptionKey =
  | "First Month"
  | "Last Month"
  | "Month Interval"
  | "Inflation"
  | "Tax Rate"
  | "Balance-Positive"
  | "Balance-Negative";

export const optionKeys: OptionKey[] = [
  "First Month",
  "Last Month",
  "Month Interval",
  "Inflation",
  "Tax Rate",
  "Balance-Positive",
  "Balance-Negative",
];

export type Balance = { [key: string]: number };

export interface OptionStore {
  Inflation?: number;
  "Tax Rate"?: number;
  "First Month"?: string;
  "Last Month"?: string;
  "Month Interval"?: number;
  "Balance-Positive"?: Balance;
  "Balance-Negative"?: Balance;
}

export const getInputType = (label: OptionKey) =>
  label === "Inflation" || label === "Tax Rate" || label === "Month Interval"
    ? "number"
    : "month";

const defaultStore: OptionStore = {
  Inflation: 4,
  "Tax Rate": 50,
  "First Month": getCurMonth(),
  "Last Month": getCurMonth(26 * 12),
  "Month Interval": 12,
};

enum ReducerTypes {
  SET_STORE,
  MODIFY_OPTION,
}

interface OptionAction {
  type: ReducerTypes;
  data: any;
}

interface ContextFunctions {
  setStore: (data: OptionStore) => void;
  modifyOption: (id: string, value: any) => void;
  getOption: (id: OptionKey) => Option;
  getBalance: (isPositive: boolean) => { [key: string]: number };
  isSet: () => boolean;
  state: OptionStore;
}

const OptionContext = createContext<ContextFunctions>(
  undefined as unknown as ContextFunctions
);

export const useOptionContext = (): ContextFunctions =>
  useContext(OptionContext);

const fixInitialStore = (store: OptionStore, investmentKeys: string[]) => {
  optionKeys.forEach((key) => {
    if (key === "Balance-Positive" || key === "Balance-Negative") {
      if (
        store[key] === undefined ||
        Object.values(store[key] as { [key: string]: number }).length === 0
      ) {
        const balance: { [key: string]: number } = {};
        investmentKeys.forEach((key) => {
          balance[key] = 100 / investmentKeys.length;
        });
        // @ts-ignore
        store[key] = balance;
      }
    } else {
      // @ts-ignore
      if (store[key] === undefined) store[key] = defaultStore[key];
    }
  });
  return store;
};

const OptionsReducer = (
  state: OptionStore,
  action: OptionAction
): OptionStore => {
  switch (action.type) {
    case ReducerTypes.SET_STORE:
      // correcting data
      const newData: OptionStore = {};
      for (const key in action.data)
        if (
          getInputType(key as OptionKey) !== "number" ||
          action.data[key] != ""
        )
          newData[key as OptionKey] = action.data[key];
      return newData;

    case ReducerTypes.MODIFY_OPTION:
      const id: OptionKey = action.data.id;
      return { ...state, [id]: action.data.value };

    default:
      return state;
  }
};

export const OptionProvider = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState<boolean>(false);
  const { getInvestmentInputValueKeys, modifyInflation, isSet } =
    useInputValueContext();

  const [state, dispatch] = useReducer(OptionsReducer, {});

  const inputValuesReady = isSet();

  const OptionFunctions = {
    setStore: (data: OptionStore) =>
      dispatch({ type: ReducerTypes.SET_STORE, data }),

    modifyOption: (id: string, value: any) => {
      if (id === "Inflation")
        modifyInflation(
          state.Inflation !== undefined
            ? state.Inflation
            : (defaultStore.Inflation as number),
          value
        );
      dispatch({
        type: ReducerTypes.MODIFY_OPTION,
        data: { id, value },
      });
    },

    getOption: (id: OptionKey) =>
      state[id] !== undefined ? state[id] : defaultStore[id],

    getBalance: (isPositive: boolean) => {
      const balanceKey = isPositive ? "Balance-Positive" : "Balance-Negative";

      const investmentKeys = getInvestmentInputValueKeys();
      const areAllPresent =
        state[balanceKey] &&
        investmentKeys.reduce(
          (acc, cur) =>
            acc && cur in (state[balanceKey] as { [key: string]: number }),
          true
        );

      if (areAllPresent)
        return state[balanceKey as OptionKey] as { [key: string]: number };

      const balance: { [key: string]: number } = {};
      investmentKeys.forEach((key) => {
        balance[key] = 100 / investmentKeys.length;
      });
      return balance;
    },

    isSet: () => ready,

    state,
  };

  useEffect(() => {
    // little hack to keep state
    window.onbeforeunload = function () {
      Cookies.set("Options", JSON.stringify(state));
    };

    if (!ready && inputValuesReady) {
      const cookieStringValue = Cookies.get("Options");
      const cookieObjectValue =
        cookieStringValue === undefined ? {} : JSON.parse(cookieStringValue);

      const keys = getInvestmentInputValueKeys();
      const fixedStore = fixInitialStore(cookieObjectValue, keys);
      dispatch({
        type: ReducerTypes.SET_STORE,
        data: fixedStore,
      });
      setReady(true);
    }
  }, [inputValuesReady]);

  return (
    <OptionContext.Provider value={OptionFunctions}>
      {children}
    </OptionContext.Provider>
  );
};
