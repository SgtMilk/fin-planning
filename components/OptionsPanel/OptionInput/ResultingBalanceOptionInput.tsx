import { useInputValueContext, useOptionContext } from "@/data";
import React, { useState } from "react";

export interface ResultingBalanceOptionInputProps {
  isPositive: boolean;
}

export const ResultingBalanceOptionInput = ({
  isPositive,
}: ResultingBalanceOptionInputProps) => {
  const { getInputValue } = useInputValueContext();
  const { modifyOption, getBalance } = useOptionContext();

  const [trigger, setTrigger] = useState<boolean>(false);
  const updatePage = () => setTrigger(!trigger);

  const balance = getBalance(isPositive);
  const investmentKeys = Object.keys(balance);

  const rebalance = (key: string, value: number) => {
    const sum = Object.values({ ...balance, [key]: value }).reduce(
      (acc, cur) => acc + cur,
      0
    );
    if (sum <= 100)
      modifyOption(`Balance-${isPositive ? "Positive" : "Negative"}`, {
        ...balance,
        [key]: value,
      });
    else {
      const diff = (sum - 100) / (investmentKeys.length - 1);
      const newBalance = { [key]: value };
      investmentKeys.forEach((otherKey) => {
        if (otherKey === key) return;
        newBalance[otherKey] = balance[otherKey] - diff;
      });
      modifyOption(
        `Balance-${isPositive ? "Positive" : "Negative"}`,
        newBalance
      );
    }
  };

  return (
    <div
      className={`m-1 p-6 bg-white border border-slate-200 rounded-lg shadow dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 w-96`}
    >
      <div className="flex align-center justify-center pb-5">
        <p>{isPositive ? "When Positive" : "When Negative"}</p>
      </div>
      {investmentKeys.map((label, i) => (
        <div className={i === 0 ? "" : "mt-3"} key={label}>
          <div key={label}>
            <label
              htmlFor={label}
              className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
            >
              {getInputValue(label).Title}
            </label>
            <input
              id={label}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 hover:bg-slate-100"
              type="number"
              value={balance[label]}
              max="100"
              min="0"
              onChange={(e: any) => {
                if (e.target.value > 100 || e.target.value < 0) return;
                rebalance(label, Number(e.target.value));
                updatePage();
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
