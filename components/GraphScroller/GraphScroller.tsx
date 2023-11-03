"use client";

import React from "react";
import { InvestmentGraph, MonthlyBalanceGraph } from "./Graphs";
import { useErrorChecker } from "@/data/errorChecker";
import { useOptionContext } from "@/data";

export const GraphScroller = () => {
  const { optionErrors, inputValueErrors, numErrors } = useErrorChecker();
  const { isSet } = useOptionContext();

  if (!isSet())
    return (
      <div className="w-full h-full overflow-scroll no-scrollbar p-7">
        <h1>Loading...</h1>
      </div>
    );

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
