import {
  BalanceSheet,
  getResultingInvestment,
} from "@/data/processingFunctions";
import React from "react";
import { GraphProps, processBalanceSheet, reduceData } from "./utils";
import { GraphCard, LineProps } from "@/components/GraphCard";

export const MonthlyBalanceGraph = ({ balanceSheet }: GraphProps) => {
  const resultingInvestment = getResultingInvestment(balanceSheet);

  const monthlyBalance = balanceSheet.map((mb, i) => {
    const monthlyEntries = Object.entries(mb).filter(
      ([_, value]) => !value.isInvestment
    );
    monthlyEntries.push([
      "x",
      {
        value: resultingInvestment[i],
        isInvestment: false,
        taxedCG: false,
        Title: "Resulting Balance",
      },
    ]);
    return Object.fromEntries(monthlyEntries);
  });

  const data = processBalanceSheet(monthlyBalance);

  const reducedData: LineProps[] = reduceData(data);

  for (let i = reducedData.length - 1; i >= 1; i--) {
    for (const key in reducedData[i]) {
      if (key == "name") continue;
      if (key in reducedData[i - 1])
        reducedData[i][key] =
          (reducedData[i][key] as number) - (reducedData[i - 1][key] as number);
    }
  }

  return <GraphCard title="Monthly Balance" data={reducedData.slice(1)} />;
};
