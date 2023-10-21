"use client";

import React from "react";
import { GraphCard, LineProps } from "../GraphCard";
import { getInvestmentBalanceSheet } from "@/data/processingFunctions";
import { useInputValueContext } from "@/data";

export const GraphScroller = () => {
  const { getBalanceSheet } = useInputValueContext();

  const balanceSheet = getBalanceSheet("2050-01");
  const investmentBalanceSheet = getInvestmentBalanceSheet(balanceSheet);

  const curDate = new Date();
  const curMonth = curDate.getMonth();
  const curYear = curDate.getFullYear();

  let data: LineProps[] = investmentBalanceSheet.map(
    (monthlyBalanceSheet, i) => {
      const processed: { name: string; [key: string]: number | string } = {
        name: `${(curMonth + i) % 12}-${
          curYear + Math.floor((curMonth + i) / 12)
        }`,
      };

      Object.values(monthlyBalanceSheet).forEach((investment) => {
        processed[investment.Title] = Math.round(investment.value * 100) / 100;
      });
      return processed;
    }
  );

  if (data.length > 25)
    data = data.reduce(
      (acc: LineProps[], cur) =>
        Number(cur.name.split("-")[0]) === curMonth ? [...acc, cur] : acc,
      []
    );

  return <GraphCard title="Investments" data={data} />;
};
