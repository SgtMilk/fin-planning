import { GraphCard, LineProps } from "@/components/GraphCard";
import { getInvestmentBalanceSheet } from "@/data/processingFunctions";
import React from "react";
import { GraphProps, processBalanceSheet, reduceData } from "./utils";

export const InvestmentGraph = ({ balanceSheet }: GraphProps) => {
  const investmentBalanceSheet = getInvestmentBalanceSheet(balanceSheet);

  const data = processBalanceSheet(investmentBalanceSheet);

  const reducedData = reduceData(data);

  return <GraphCard title="Investments" data={reducedData} />;
};
