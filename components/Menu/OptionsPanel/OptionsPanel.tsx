"use client";

import React, { useState } from "react";
import { CaretIcon, MenuIcon } from "../../common";
import {
  ConnectedSingleOptionInput,
  ResultingBalanceOptionInput,
} from "./OptionInput";
import { SectionCard } from "@/components/common/styles";

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
    <SectionCard addDrop={isOpen ? children : null}>
      <div className="w-5">
        <CaretIcon {...{ isOpen, setIsOpen }} />
      </div>

      <div className="h-7 overflow-none">
        <p>{title}</p>
      </div>

      <div className="flex flex-row w-5"></div>
    </SectionCard>
  );
};
