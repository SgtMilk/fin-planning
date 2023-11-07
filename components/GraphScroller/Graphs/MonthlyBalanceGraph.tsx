import { useGetResultingBalanceSheet } from "@/data/processingFunctions";
import React from "react";
import { useProcessDataFunctions } from "./utils";
import { GraphCard } from "@/components/GraphCard";
import { useOptionContext } from "@/data";

export const MonthlyBalanceGraph = () => {
  const { getOption } = useOptionContext();
  const { balanceSheet, initialMonth } = useGetResultingBalanceSheet(
    getOption("Last Month")
  );
  const processedData = useProcessDataFunctions(
    balanceSheet,
    initialMonth,
    false
  );

  return <GraphCard title="Monthly Balance" data={processedData} />;
};
