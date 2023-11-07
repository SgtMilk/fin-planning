import { LineProps } from "@/components/GraphCard";
import { useOptionContext } from "@/data";
import { BalanceSheet } from "@/data/processingFunctions";
import { getCurMonth } from "@/data/utils";

export interface GraphProps {
  balanceSheet: BalanceSheet;
}

export const useProcessDataFunctions = (
  balanceSheet: BalanceSheet,
  initialMonth: string,
  isAlreadySum: boolean
) => {
  const data = processBalanceSheet(balanceSheet, initialMonth);
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
  balanceSheet: BalanceSheet,
  initialMonth: string
): LineProps[] => {
  const [initialY, initialM] = initialMonth.split("-");
  const [curY, curM] = getCurMonth().split("-");
  const offset =
    (Number(initialY) - Number(curY)) * 12 + Number(initialM) - Number(curM);
  return balanceSheet.map((monthlyBalanceSheet, i) => {
    const processed: { name: string; [key: string]: number | string } = {
      name: getCurMonth(i + offset),
    };

    Object.values(monthlyBalanceSheet).forEach((investment) => {
      processed[investment.Title] = investment.value;
    });
    return processed;
  });
};
