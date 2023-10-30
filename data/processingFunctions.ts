import { InputValueStore, useInputValueContext, useOptionContext } from ".";

export interface BalanceSheetEntry {
  value: number;
  Title: string;
}

export type BalanceSheet = Array<{ [key: string]: BalanceSheetEntry }>;

export const getNewKey = () => Math.random().toString(36).substring(2, 12); // 10 digit key

export const useGetResultingBalanceSheet = (finalMonth: string) => {
  const { state } = useInputValueContext();

  // removing investments
  const newState: InputValueStore = {};
  for (const key in state)
    if (state[key]["APY (%)"] == 0) newState[key] = state[key];

  const balanceSheet = inputValuesToBalanceSheet(newState, finalMonth, () => 0);

  // calculting resulting balance
  let lastValue = 0;
  let lastNonInvestmentBalance = 0;
  const resultingBalance: Array<number> = [];

  balanceSheet.forEach((elements) => {
    const balance = Object.values(elements).reduce(
      (acc, cur) => acc + cur.value,
      0
    );

    lastValue = lastValue + balance - lastNonInvestmentBalance;
    lastNonInvestmentBalance = balance;

    resultingBalance.push(lastValue);
  });

  // adding the resulting balance to the balance sheet
  const monthlyBalance = balanceSheet.map((mb, i) => {
    const monthlyEntries = Object.entries(mb);
    monthlyEntries.push([
      "x",
      {
        value: resultingBalance[i],
        Title: "Resulting Balance",
      },
    ]);
    return Object.fromEntries(monthlyEntries);
  });

  return { balanceSheet: monthlyBalance, resultingBalance };
};

export const useGetInvestmentBalanceSheet = (
  finalMonth: string
): BalanceSheet => {
  const { getBalance } = useOptionContext();
  const { state } = useInputValueContext();
  const [positiveBalance, negativeBalance] = [true, false].map((arg) =>
    getBalance(arg)
  );
  const { resultingBalance } = useGetResultingBalanceSheet(finalMonth);

  const getMonthlyResultingBalance = (i: number, key: string) => {
    const mri = resultingBalance[i];
    const balanceContribution =
      ((mri >= 0 ? positiveBalance[key] : negativeBalance[key]) / 100) * mri;
    return balanceContribution;
  };

  // fixing resulting balance so that it's not accumulative
  for (let i = resultingBalance.length - 1; i >= 1; i--) {
    resultingBalance[i] = resultingBalance[i] - resultingBalance[i - 1];
  }

  // removing non-investments
  const newState: InputValueStore = {};
  for (const key in state)
    if (state[key]["APY (%)"] != 0) newState[key] = state[key];

  const balanceSheet = inputValuesToBalanceSheet(
    newState,
    finalMonth,
    getMonthlyResultingBalance
  );

  // adding total to investments
  const balanceSheetWithTotal = balanceSheet.map((mb, i) => {
    const monthlyEntries = Object.entries(mb);
    monthlyEntries.push([
      "x",
      {
        value: monthlyEntries.reduce((acc, cur) => acc + cur[1].value, 0),
        Title: "Total",
      },
    ]);
    return Object.fromEntries(monthlyEntries);
  });

  return balanceSheetWithTotal;
};

const inputValuesToBalanceSheet = (
  state: InputValueStore,
  finalMonth: string,
  getMonthlyResultingBalance: (i: number, key: string) => number
) => {
  // finding the initial month
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
    const initialIndex = findNumMonths(initialDate, elementInitialDate);

    const [apm, cim] = [
      element["APY (%)"],
      element["Contribution IPY (%)"],
    ].map((num) => Math.pow(num / 100 + 1, 1 / 12));

    let lastValue = element["Current Value"];
    for (let i = 0; i < totalNumMonths; i++) {
      const balanceContribution = getMonthlyResultingBalance(i, key);
      const contribution =
        (i < elementNumMonths
          ? element["Contribution / Month"] * Math.pow(cim, i + 1)
          : 0) + balanceContribution;
      lastValue = lastValue * apm + contribution;
      balanceSheet[i + initialIndex][key] = {
        value: lastValue,
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
