"use client";

import React, { useState } from "react";
import { CaretIcon, MenuIcon } from "../../Base";
import {
  ConnectedSingleOptionInput,
  ResultingBalanceOptionInput,
} from "./OptionInput";

export const OptionsPanel = () => {
  return (
    <div className={`overflow-scroll no-scrollbar`}>
      <OptionsPanelSection title="Constants">
        <div>
          <ConnectedSingleOptionInput label="Inflation" />
        </div>
      </OptionsPanelSection>
      <OptionsPanelSection title="Graph">
        <div>
          <ConnectedSingleOptionInput label="Month Interval" />
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
  );
};

export interface OptionsPanelSectionProps {
  title: string;
  children: React.ReactNode;
}

const OptionsPanelSection = ({ title, children }: OptionsPanelSectionProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="border border-slate-300 dark:border-slate-700 p-1">
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
