"use client";

import React from "react";
import { InvestmentGraph, MonthlyBalanceGraph } from "./Graphs";

export const GraphScroller = () => {
  const graphs = [MonthlyBalanceGraph, InvestmentGraph];

  return (
    <div className="w-full h-full overflow-scroll no-scrollbar">
      {graphs.map((Element, i) => (
        <div className="w-full h-full" key={`graph-${i}`}>
          <Element />
        </div>
      ))}
    </div>
  );
};
