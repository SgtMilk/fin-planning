# Fin-Planning

**&#x26A0; Notice:** If you want to save your work, don't forget to hit ctrl/cmd for pc/mac + s. This will save your data to your browser's local storage (everything is saved on your computer 🚀). **Do not** delete your browsing data on this website if you want to keep your work.

## How this works

This app is basically a concatenation of graph calculator with the output graphed out.

The different inputs are divided in 2 categories:
- **Expenses/Income** (APY = 0)
- **Investments** (APY not = 0)

... where APY is appreciation per year.

The Expenses/Income category will be graphed out in the Monthly Balance graph and the Investments category in the Investment graph. For each month, the resulting balance of all your expenses and incomes will be dumped in an investment. This is why **you need at least one investment (APY not = 0) input to your page**. If you don't want this behaviour, just create another input with a incredibly small APY.

What differentiates expenses from income is that expenses are negative and income is positive when inputting in the `Contribution / Month` category.

## Pages
Pages help you organise your different calculations. Each page is an isolated environment, with it's own inputs and options.

## Inputs

You can start by adding categories and values in the Inputs tab on the left. You can also explore the Raw Data tab, it gives you more liberty on the inputs, and you can choose your own categories. Each value may have the following options depending on the input type:

- **Title:** the displayed title on the graph.
- **Contribution / Month:** how much money is contributed to this value every month.
- **Start Date:** when the contributions start (inclusive)
- **End Date:** when the contributions stop (inclusive)
- **Contribution IPY (%):** how much the contributions will augment with time, in percentage per year.
- **APY (%):** how much the value of an investment will go up per year, in percentage per year.
- **Current Value:** the value at the moment, outside of contributions.

...and the following shortcuts:

- **One-Time:** sets the end date to the start date.
- **No End Date:** sets the end date in the year 2500.
- **CI = Inflation:** sets the Contribution IPY to the inflation set in the options.

## Options
- **Constants**:
    - **Inflation:** sets the averare yearly inflation, in % per year.
- **Graph**:
    - **Month Interval:** sets on the graphs the month interval where values are shown (ex: 1 for monthly and 12 for yearly).
    - **First Month:** the first month shown on the graphs.
    - **Last Month:** the last month shown on the graphs.
- **Resulting Balance:** for a positive or a negative balance, setsin which investment to drop the remaining balance, in percentage.
