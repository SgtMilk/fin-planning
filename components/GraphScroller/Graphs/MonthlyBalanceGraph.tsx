import { useGetResultingBalance } from "@/data/processingFunctions";
import React from "react";
import { processBalanceSheet, reduceData } from "./utils";
import { GraphCard, LineProps } from "@/components/GraphCard";
import { useOptionContext } from "@/data";

export const MonthlyBalanceGraph = () => {
  const { getOption } = useOptionContext();
  const { balanceSheet } = useGetResultingBalance(getOption("Last Month"));

  const data = processBalanceSheet(balanceSheet);

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
