import { GraphCard } from "@/components/GraphScroller/GraphCard";
import { useGetInvestmentBalanceSheet } from "@/data/processingFunctions";
import React from "react";
import { useProcessDataFunctions } from "./utils";
import { useOptionContext } from "@/data";

export const InvestmentGraph = () => {
  const { getOption } = useOptionContext();
  const { balanceSheet: investmentBalanceSheet, initialMonth } =
    useGetInvestmentBalanceSheet(getOption("Last Month"));

  const processedData = useProcessDataFunctions(
    investmentBalanceSheet,
    initialMonth,
    true
  );

  return <GraphCard title="Investments" data={processedData} />;
};
