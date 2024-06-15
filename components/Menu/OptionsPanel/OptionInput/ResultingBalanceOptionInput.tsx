import { InfoCard, InputWithLabel } from "@/components/common/styles";
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
    modifyOption(`Balance-${isPositive ? "Positive" : "Negative"}`, {
      ...balance,
      [key]: value,
    });
  };

  return (
    <InfoCard isGrid={false}>
      <div className="flex flex-col w-full">
        <div className="flex align-center justify-center">
          <p>{isPositive ? "When Positive" : "When Negative"}</p>
        </div>
        {investmentKeys.map((label) => {
          const inputProps = {
            label: getInputValue(label)?.Title || "Name missing",
            inputProps: {
              type: "number",
              value: balance[label],
              onChange: (e: any) => {
                rebalance(label, e.target.value);
                updatePage();
              },
            },
          };
          return (
            <div key={label} className="pt-3">
              <InputWithLabel {...inputProps} />
            </div>
          );
        })}
      </div>
    </InfoCard>
  );
};
