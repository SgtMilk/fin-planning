import { InputValueStore } from ".";

export interface BalanceSheetEntry {
  value: number;
  isInvestment: boolean;
  taxedCG: boolean;
  Title: string;
}

const investmentAPY = 1;

export type BalanceSheet = Array<{ [key: string]: BalanceSheetEntry }>;

export const getNewKey = () => Math.random().toString(36).substring(2, 12); // 10 digit key

export const getResultingInvestment = (balanceSheet: BalanceSheet) => {
  let lastValue = 0;
  const investmentValues: Array<number> = [];

  let lastNonInvestmentBalance = 0;

  balanceSheet.forEach((elements) => {
    const nonInvestmentBalance = Object.values(elements).reduce(
      (acc, cur) => (cur.isInvestment ? acc : acc + cur.value),
      0
    );

    lastValue =
      lastValue * investmentAPY +
      nonInvestmentBalance -
      lastNonInvestmentBalance;
    lastNonInvestmentBalance = nonInvestmentBalance;

    investmentValues.push(lastValue);
  });

  return investmentValues;
};

export const getInvestmentBalanceSheet = (
  balanceSheet: BalanceSheet
): BalanceSheet => {
  const resultingInvestment = getResultingInvestment(balanceSheet);

  const investmentBalanceSheet = balanceSheet.map((elements, i) => {
    const investmentElements: { [key: string]: BalanceSheetEntry } = {};

    Object.entries(elements).forEach(
      ([key, value]: [string, BalanceSheetEntry]) => {
        if (value.isInvestment) investmentElements[key] = value;
      }
    );

    investmentElements[getNewKey()] = {
      value: resultingInvestment[i],
      isInvestment: true,
      taxedCG: true,
      Title: "Resulting Investment",
    };
    return investmentElements;
  });

  return investmentBalanceSheet;
};

export const getMonthlyBalanceSheet = (
  finalMonth: string,
  state: InputValueStore
): BalanceSheet => {
  const bigValue = "2500-01";
  let initialMonth = Object.values(state).reduce(
    (acc, cur) =>
      cur["Start Date"].localeCompare(acc) < 0 ? cur["Start Date"] : acc,
    bigValue
  );

  if (initialMonth === bigValue) {
    const curDate = new Date();
    initialMonth = `${curDate.getFullYear()}-${
      curDate.getMonth() < 10 ? "0" : ""
    }${curDate.getMonth()}`;
  }

  const [initialDate, finalDate, numMonths] = findDateValues(
    initialMonth,
    finalMonth
  );

  const balanceSheet: BalanceSheet = Array(numMonths)
    .fill(undefined)
    .map(() => ({}));

  Object.entries(state).forEach(([key, element]) => {
    const [elementInitialDate, _, elementNumMonths] = findDateValues(
      element["Start Date"],
      element["End Date"]
    );

    const totalNumMonths = findNumMonths(elementInitialDate, finalDate) + 1;
    const initialIndex = findNumMonths(elementInitialDate, initialDate);

    const [apm, cim] = [
      element["APY (%)"],
      element["Contribution IPY (%)"],
    ].map((num) => Math.pow(num / 100 + 1, 1 / 12));

    let lastValue = element["Current Value"];
    for (let i = 0; i < totalNumMonths; i++) {
      const contribution =
        i < elementNumMonths
          ? element["Contribution / Month"] * Math.pow(cim, i + 1)
          : 0;
      lastValue = lastValue * apm + contribution;
      balanceSheet[i + initialIndex][key] = {
        value: lastValue,
        isInvestment: element["APY (%)"] != 0,
        taxedCG: element["Taxed CG"],
        Title: element.Title,
      };
    }
  });

  return balanceSheet;
};

const findDateValues = (
  initialMonth: string,
  finalMonth: string
): [Date, Date, number] => {
  const [initialDate, finalDate] = [initialMonth, finalMonth].map(
    (date) => new Date(date)
  );

  const numMonths = findNumMonths(initialDate, finalDate) + 1;

  return [initialDate, finalDate, numMonths];
};

const findNumMonths = (initialDate: Date, finalDate: Date) =>
  (finalDate.getFullYear() - initialDate.getFullYear()) * 12 +
  finalDate.getMonth() -
  initialDate.getMonth();
