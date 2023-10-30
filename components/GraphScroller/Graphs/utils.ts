import { LineProps } from "@/components/GraphCard";
import { useOptionContext } from "@/data";
import { BalanceSheet } from "@/data/processingFunctions";

export interface GraphProps {
  balanceSheet: BalanceSheet;
}

export const useReduceData = (data: LineProps[], isSum: boolean = true) => {
  const { getOption } = useOptionContext();

  const interval = getOption("Month Interval");

  data = data.reduce(
    (acc: LineProps[], cur, i) => (i % interval === 0 ? [...acc, cur] : acc),
    []
  );

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
