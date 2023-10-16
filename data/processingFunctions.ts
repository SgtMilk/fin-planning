import { InputValueStore } from ".";

export type BalanceSheet = Array<{ [key: string]: number }>;

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

  const balanceSheet = Array(numMonths)
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
      element["Contribution Increase"],
    ].map((num) => Math.pow(num / 100 + 1, 1 / 12));

    let lastValue = 0;
    for (let i = 0; i < totalNumMonths; i++) {
      const contribution =
        i < elementNumMonths
          ? element["Current Value"] * Math.pow(cim, i + 1)
          : 0;
      lastValue = lastValue * apm + contribution;
      balanceSheet[i + initialIndex][element.Title] = lastValue;
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
