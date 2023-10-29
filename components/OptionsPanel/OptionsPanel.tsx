"use client";

import React, { useState } from "react";
import { CaretIcon, MenuIcon } from "..";
import {
  ConnectedSingleOptionInput,
  ResultingBalanceOptionInput,
} from "./OptionInput";

export const OptionsPanel = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-row align-start absolute right-0">
      <button
        className="h-min bg-cyan-700 hover:bg-cyan-900 text-slate-100 rounded p-3 flex flex-row"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="pt-1">
          <MenuIcon />
        </div>
        <p className="pl-3">Options</p>
      </button>
      {isOpen ? (
        <div className={`h-screen overflow-scroll no-scrollbar bg-slate-200`}>
          <OptionsPanelSection title="Constants">
            <div>
              <ConnectedSingleOptionInput label="Inflation" />
              <ConnectedSingleOptionInput label="Tax Rate" />
            </div>
          </OptionsPanelSection>
          <OptionsPanelSection title="Graph">
            <div>
              <ConnectedSingleOptionInput label="First Month" />
              <ConnectedSingleOptionInput label="Last Month" />
            </div>
          </OptionsPanelSection>
          <OptionsPanelSection title="Resulting Balance">
            <div>
              <ResultingBalanceOptionInput isPositive={true} />
              <ResultingBalanceOptionInput isPositive={false} />
            </div>
          </OptionsPanelSection>
        </div>
      ) : null}
    </div>
  );
};

export interface OptionsPanelSectionProps {
  title: string;
  children: React.ReactNode;
}

const OptionsPanelSection = ({ title, children }: OptionsPanelSectionProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="border border-slate-300 p-1">
      <div className="px-1 py-5 text-lg">
        <div className="flex flex-row justify-between w-96 px-6">
          <div className="w-5">
            <CaretIcon {...{ isOpen, setIsOpen }} />
          </div>

          <div className="h-7 overflow-none">
            <p>{title}</p>
          </div>

          <div className="flex flex-row w-5"></div>
        </div>
      </div>
      <div className="w-full flex justify-center">
        {isOpen ? children : null}
      </div>
    </div>
  );
};
