import { GraphCard } from "@/components/GraphCard";
import { useGetInvestmentBalanceSheet } from "@/data/processingFunctions";
import React from "react";
import {
  processBalanceSheet,
  useProcessDataFunctions,
  useReduceData,
} from "./utils";
import { useOptionContext } from "@/data";

export const InvestmentGraph = () => {
  const { getOption } = useOptionContext();
  const investmentBalanceSheet = useGetInvestmentBalanceSheet(
    getOption("Last Month")
  );

  const processedData = useProcessDataFunctions(investmentBalanceSheet, true);

  return <GraphCard title="Investments" data={processedData} />;
};
