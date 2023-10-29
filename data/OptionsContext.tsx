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

export type Option = any;

export type OptionKey =
  | "First Month"
  | "Last Month"
  | "Inflation"
  | "Tax Rate"
  | "Balance-Positive"
  | "Balance-Negative";

export interface OptionStore {
  Inflation?: number;
  "Tax Rate"?: number;
  "First Month"?: string;
  "Last Month"?: string;
  "Balance-Positive"?: {
    [key: string]: number;
  };
  "Balance-Negative"?: {
    [key: string]: number;
  };
}

export const getInputType = (label: OptionKey) =>
  label === "Inflation" || label === "Tax Rate" ? "number" : "month";

const getCurMonth = (yearOffset: number) => {
  const curDate = new Date();
  const curMonth = curDate.getMonth();
  return `${curDate.getFullYear() + yearOffset}-${
    curMonth < 10 ? "0" : ""
  }${curMonth}`;
};

const defaultStore: OptionStore = {
  Inflation: 4,
  "Tax Rate": 50,
  "First Month": getCurMonth(0),
  "Last Month": getCurMonth(26),
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
}

const OptionContext = createContext<ContextFunctions>(
  undefined as unknown as ContextFunctions
);

export const useOptionContext = (): ContextFunctions =>
  useContext(OptionContext);

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
  const { getInvestmentInputValueKeys, modifyInflation } =
    useInputValueContext();

  const [state, dispatch] = useReducer(OptionsReducer, {});

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
  };

  useEffect(() => {
    // little hack to keep state
    window.onbeforeunload = function () {
      Cookies.set("Options", JSON.stringify(state));
    };

    if (!ready) {
      const cookieStringValue = Cookies.get("Options");
      dispatch({
        type: ReducerTypes.SET_STORE,
        data: cookieStringValue ? JSON.parse(cookieStringValue) : {},
      });
      setReady(true);
    }
  });

  return (
    <OptionContext.Provider value={OptionFunctions}>
      {children}
    </OptionContext.Provider>
  );
};
