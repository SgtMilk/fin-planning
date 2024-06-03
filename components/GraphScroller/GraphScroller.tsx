"use client";

import React from "react";
import { InvestmentGraph, MonthlyBalanceGraph } from "./Graphs";
import { useErrorChecker } from "@/data/errorChecker";
import { useInputValueContext } from "@/data";

export const GraphScroller = ({
  openInstructions,
}: {
  openInstructions: boolean;
}) => {
  const { optionErrors, inputValueErrors, numErrors } = useErrorChecker();
  const { isEmpty } = useInputValueContext();

  if (isEmpty() || openInstructions) {
    return (
      <div className="w-full h-full overflow-scroll no-scrollbar p-7">
        <h1 className="text-3xl font-extrabold dark:text-white">Welcome!</h1>
        <br />
        <div>
          <b>&#x26A0; Notice:</b> If you want to save your work, don&apos;t
          forget to hit ctrl/cmd for pc/mac + s. This will save your data to
          your cookies (everything is saved on your computer 🚀). <b>Do not</b>{" "}
          delete the cookies on this website if you want to keep your work.
        </div>
        <br />
        <h1 className="text-2xl font-extrabold dark:text-white">Inputs</h1>
        <br />
        <p>
          You can start by adding categories and values in the Inputs tab on the
          left. This app works like a concatenation of multiple financial
          calculators. Each value has the following options:
        </p>
        <br />
        <ul className="list-disc px-5">
          <li>
            <b>Title:</b> the displayed title on the graph.
          </li>
          <li>
            <b>Contribution / Month:</b> how much money is contributed to this
            value every month.
          </li>
          <li>
            <b>Start Date:</b> when the contributions start (inclusive)
          </li>
          <li>
            <b>End Date:</b> when the contributions stop (inclusive)
          </li>
          <li>
            <b>Contribution IPY (%):</b> how much the contributions will augment
            with time, in percentage per year.
          </li>
          <li>
            <b>APY (%):</b> how much the value of an investment will go up per
            year, in percentage per year.
          </li>
          <li>
            <b>Current Value:</b> the value at the moment, outside of
            contributions.
          </li>
        </ul>
        <br />
        <p>...and the following shortcuts:</p>
        <br />
        <ul className="list-disc px-5">
          <li>
            <b>One-Time:</b> sets the end date to the start date.
          </li>
          <li>
            <b>No End Date:</b> sets the end date in the year 2500.
          </li>
          <li>
            <b>CI = Inflation:</b> sets the CAPY to the inflation set in the
            options.
          </li>
        </ul>
        <br />
        <h1 className="text-2xl font-extrabold dark:text-white">Options</h1>
        <br />
        <ul className="list-disc px-5">
          <li>
            <b>Constants:</b>
            <br />
            <ul className="list-disc px-5">
              <li>
                <b>Inflation:</b> sets the averare yearly inflation, in % per
                year.
              </li>
            </ul>
          </li>
          <li>
            <b>Graph:</b>
            <br />
            <ul className="list-disc px-5">
              <li>
                <b>Month Interval:</b> sets on the graphs the month interval
                where values are shown (ex: 1 for monthly and 12 for yearly).
              </li>
              <li>
                <b>First Month:</b> the first month shown on the graphs.
              </li>
              <li>
                <b>Last Month:</b> the last month shown on the graphs.
              </li>
            </ul>
          </li>
          <li>
            <b>Resulting Balance:</b> for a positive or a negative balance, sets
            in which investment to drop the remaining balance, in percentage.
          </li>
        </ul>
      </div>
    );
  }

  if (numErrors) {
    return (
      <div className="w-full h-full overflow-scroll no-scrollbar p-7">
        {[optionErrors, inputValueErrors].map((errors, i) => {
          const errName = i ? "Input Errors" : "Option Errors";
          return errors.length ? (
            <div key={errName}>
              <b>{errName}</b>
              <ul>
                {errors.map((err, i) => (
                  <li key={`err-${i}`}>{err}</li>
                ))}
              </ul>
            </div>
          ) : null;
        })}
      </div>
    );
  } else {
    const graphs = [MonthlyBalanceGraph, InvestmentGraph];
    return (
      <div className="w-full h-full overflow-scroll no-scrollbar">
        {graphs.map((Element, i) => (
          <div className="w-full h-full" key={`graph-${i}`}>
            <Element />
          </div>
        ))}
      </div>
    );
  }
};
