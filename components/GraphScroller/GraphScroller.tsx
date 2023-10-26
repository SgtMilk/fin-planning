"use client";

import React from "react";
import { useInputValueContext } from "@/data";
import { InvestmentGraph, MonthlyBalanceGraph } from "./Graphs";

export const GraphScroller = () => {
  const { getBalanceSheet } = useInputValueContext();

  const balanceSheet = getBalanceSheet("2050-01");

  const graphs = [InvestmentGraph, MonthlyBalanceGraph];

  return (
    <div className="w-full h-full overflow-scroll no-scrollbar">
      {graphs.map((Element, i) => (
        <div className="w-full h-full" key={`graph-${i}`}>
          <Element balanceSheet={balanceSheet} />
        </div>
      ))}
    </div>
  );
};
