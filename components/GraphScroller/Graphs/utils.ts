import { LineProps } from "@/components/GraphCard";
import { BalanceSheet } from "@/data/processingFunctions";

export interface GraphProps {
  balanceSheet: BalanceSheet;
}

export const reduceData = (data: LineProps[], isSum: boolean = true) => {
  if (data.length > 25) {
    const curDate = new Date();
    const month = isSum ? curDate.getMonth() : (curDate.getMonth() - 1) % 12;
    data = data.reduce(
      (acc: LineProps[], cur) =>
        Number(cur.name.split("-")[1]) === month ? [...acc, cur] : acc,
      []
    );
  }
  return data;
};

export const processBalanceSheet = (
  balanceSheet: BalanceSheet
): LineProps[] => {
  const curDate = new Date();
  const curMonth = curDate.getMonth();
  const curYear = curDate.getFullYear();

  return balanceSheet.map((monthlyBalanceSheet, i) => {
    const month = (curMonth + i) % 12;
    const processed: { name: string; [key: string]: number | string } = {
      name: `${curYear + Math.floor((curMonth + i) / 12)}-${
        month < 10 ? "0" : ""
      }${month}`,
    };

    Object.values(monthlyBalanceSheet).forEach((investment) => {
      processed[investment.Title] = investment.value;
    });
    return processed;
  });
};
