import { LineProps } from "@/components/GraphCard";
import { useOptionContext } from "@/data";
import { BalanceSheet } from "@/data/processingFunctions";
import { getCurMonth } from "@/data/utils";

export interface GraphProps {
  balanceSheet: BalanceSheet;
}

export const useProcessDataFunctions = (
  balanceSheet: BalanceSheet,
  isAlreadySum: boolean
) => {
  const data = processBalanceSheet(balanceSheet);
  const reducedData = useReduceData(data, isAlreadySum);
  const slicedData = useRemoveInitialMonths(reducedData);
  return slicedData;
};

export const useRemoveInitialMonths = (data: LineProps[]) => {
  const { getOption } = useOptionContext();
  const initialMonth = getOption("First Month");

  let i;
  for (i = 0; i < data.length; i++) {
    if (initialMonth.localeCompare(data[i].name) <= 0) break;
  }
  if (i !== 0) i--;
  return data.slice(i);
};

export const useReduceData = (data: LineProps[], isAlreadySum: boolean) => {
  const { getOption } = useOptionContext();

  const interval = getOption("Month Interval");

  if (!isAlreadySum)
    data.forEach((d, i) => {
      if (i % interval === 0) return;
      for (const key in data[i - 1]) {
        if (key === "name") continue;
        if (key in d)
          d[key] = (d[key] as number) + (data[i - 1][key] as number);
        else d[key] = data[i - 1][key];
      }
    });

  data = data.filter((_, i) => {
    return (i + 1) % interval === 0;
  });

  return data;
};

export const processBalanceSheet = (
  balanceSheet: BalanceSheet
): LineProps[] => {
  return balanceSheet.map((monthlyBalanceSheet, i) => {
    const processed: { name: string; [key: string]: number | string } = {
      name: getCurMonth(i),
    };

    Object.values(monthlyBalanceSheet).forEach((investment) => {
      processed[investment.Title] = investment.value;
    });
    return processed;
  });
};
