import { useGetResultingBalanceSheet } from "@/data/processingFunctions";
import React from "react";
import {
  processBalanceSheet,
  useProcessDataFunctions,
  useReduceData,
} from "./utils";
import { GraphCard, LineProps } from "@/components/GraphCard";
import { useOptionContext } from "@/data";

export const MonthlyBalanceGraph = () => {
  const { getOption } = useOptionContext();
  const { balanceSheet } = useGetResultingBalanceSheet(getOption("Last Month"));
  const processedData = useProcessDataFunctions(balanceSheet, false);

  return <GraphCard title="Monthly Balance" data={processedData} />;
};
