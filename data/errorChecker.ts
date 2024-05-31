import {
  Balance,
  inputValueKeys,
  optionKeys,
  useInputValueContext,
  useOptionContext,
} from ".";

export const useErrorChecker = () => {
  const optionErrors = useGetOptionErrors();
  const inputValueErrors = useGetInputValuesErrors();
  const numErrors = optionErrors.length + inputValueErrors.length;
  return { optionErrors, inputValueErrors, numErrors };
};

const useGetOptionErrors = () => {
  const { state } = useOptionContext();
  const errors: string[] = [];

  optionKeys.forEach((key) => {
    if (state[key] === undefined)
      errors.push(`[${key}] Option ${key} not set.`);
  });

  for (const key in state) {
    switch (key) {
      case "First Month":
        const startDateFault =
          (state[key] as string).localeCompare(state["Last Month"] as string) >
          0;
        if (startDateFault)
          errors.push(
            "[First Month/Last Month] Graph first month is chronologically after last month."
          );
        break;
      case "Last Month":
        break;
      case "Month Interval":
        if ((state[key] as number) < 1)
          errors.push(`[${key}] ${key} is below 1.`);
        break;
      case "Inflation":
      case "Tax Rate":
        if ((state[key] as number) < 0)
          errors.push(`[${key}] ${key} is below 0.`);
        break;
      case "Balance-Positive":
      case "Balance-Negative":
        // checking if there are investments
        if (
          typeof state[key] != "object" ||
          Object.keys(state[key] as Balance).length === 0
        ) {
          errors.push(
            `[${key}] There are no investments to dump your balance into (change API to positive number of one of your values).`
          );
          break;
        }

        let sum = 0;
        Object.values(state[key] as Balance).forEach((b) => {
          const nb = Number(b);
          sum += nb;
          if (nb < 0)
            errors.push(`[${key}] One of the balance values is under 0.`);
        });

        const diff = 100 - sum;
        if (diff < 0 || diff > 0.1)
          errors.push(
            `[${key}] Balance doesn't add up to 100 (or close to 100).`
          );
        break;
      default:
        console.error("No Error Checking for", key);
    }
  }
  return errors;
};

const useGetInputValuesErrors = () => {
  const { state } = useInputValueContext();
  const errors: string[] = [];

  for (const inputKey in state) {
    inputValueKeys.forEach((key) => {
      if (state[inputKey][key] === undefined)
        errors.push(
          `[${state[inputKey].Type}/${state[inputKey].Title}] Input's ${key} not set.`
        );
    });
    for (const key in state[inputKey]) {
      switch (key) {
        case "Title":
        case "Current Value":
        case "Taxed CG":
        case "Type":
        case "Contribution / Month":
          break;
        case "Start Date":
          const startDateFault =
            (state[inputKey][key] as string).localeCompare(
              state[inputKey]["End Date"] as string
            ) > 0;
          if (startDateFault)
            errors.push(
              `[${state[inputKey].Type}/${state[inputKey].Title}] Input's start date is chronologically after it's end date.`
            );
          break;
        case "End Date":
          break;
        case "Contribution IPY (%)":
        case "APY (%)":
          if (state[inputKey][key] < 0)
            errors.push(
              `[${state[inputKey].Type}/${state[inputKey].Title}] Input's ${key} is below 0.`
            );
          break;
        default:
          console.error("No Error Checking for", key);
      }
    }
  }

  return errors;
};
