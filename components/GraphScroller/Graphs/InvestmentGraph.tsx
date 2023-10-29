import { GraphCard } from "@/components/GraphCard";
import { useGetInvestmentBalanceSheet } from "@/data/processingFunctions";
import React from "react";
import { processBalanceSheet, reduceData } from "./utils";
import { useOptionContext } from "@/data";

export const InvestmentGraph = () => {
  const { getOption } = useOptionContext();
  const investmentBalanceSheet = useGetInvestmentBalanceSheet(
    getOption("Last Month")
  );

  const data = processBalanceSheet(investmentBalanceSheet);

  const reducedData = reduceData(data);

  return <GraphCard title="Investments" data={reducedData.slice(1)} />;
};
