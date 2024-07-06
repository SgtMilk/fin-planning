"use client";

import React, { useEffect, useState } from "react";
import { InvestmentGraph, MonthlyBalanceGraph } from "./Graphs";
import { useErrorChecker } from "@/data/errorChecker";
import { useInputValueContext } from "@/data";
import ReactMarkdown from "react-markdown";

const GraphScroller = ({ openInstructions }: { openInstructions: boolean }) => {
  const { optionErrors, inputValueErrors, numErrors } = useErrorChecker();
  const { isEmpty } = useInputValueContext();
  const [manual, setManual] = useState<string>("")

  useEffect(() => {
    fetch("README.md")
      .then((res) => res.text())
      .then((text) => setManual(text));
  }, []);

  if (isEmpty() || openInstructions) {
    return (
      <div className="unreset w-full h-full overflow-scroll no-scrollbar px-10 pb-5 fadeIn">
        <ReactMarkdown>{manual}</ReactMarkdown>
      </div>
      )
  }

  if (numErrors) {
    return (
      <div className="w-full h-full overflow-scroll no-scrollbar p-7 fadeIn">
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
      <div className="w-full h-full overflow-scroll no-scrollbar fadeIn flex flex-row flex-wrap">
        {graphs.map((Element, i) => (
          <div className="w-full h-1/2" key={`graph-${i}`}>
            <Element />
          </div>
        ))}
      </div>
    );
  }
};

export default GraphScroller;
