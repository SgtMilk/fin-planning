"use client";

import {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useInputValueContext } from ".";
import { getCookies, getCurMonth, setCookies } from "./utils";

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
  saveOptionsContext: () => void;
  checkOptionsChange: () => boolean;
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
      const compare = (list1: string[], list2: string[]) => {
        if (list1.length != list2.length) return false;
        const sorted1 = list1.sort();
        const sorted2 = list2.sort();
        for (let i = 0; i < sorted1.length; i++) {
          if (sorted1[i] !== sorted2[i]) return false;
        }

        return true;
      };

      if (!compare(investmentKeys, Object.keys(store[key] || [])))
        store[key] = undefined;

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
  const { getInvestmentInputValueKeys, modifyInflation } =
    useInputValueContext();

  const cookies = getCookies("Options");

  const investmentKeys = getInvestmentInputValueKeys();
  const fixedStore = fixInitialStore(cookies, investmentKeys);
  const [state, dispatch] = useReducer(OptionsReducer, fixedStore);

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

    saveOptionsContext: () => {
      setCookies("Options", state);
    },

    checkOptionsChange: () => {
      const cookies = getCookies("Options");
      return JSON.stringify(cookies) !== JSON.stringify(state);
    },

    state,
  };

  useEffect(() => {
    const keys = investmentKeys;
    const stateCopy = JSON.parse(JSON.stringify(state));
    const fixedStore = fixInitialStore(stateCopy, keys);
    if (JSON.stringify(fixedStore) !== JSON.stringify(state)) {
      dispatch({
        type: ReducerTypes.SET_STORE,
        data: fixedStore,
      });
    }
  }, [investmentKeys]);

  return (
    <OptionContext.Provider value={OptionFunctions}>
      {children}
    </OptionContext.Provider>
  );
};
