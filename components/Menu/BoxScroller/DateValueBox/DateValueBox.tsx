"use client";

import React, { useState } from "react";
import { InputValue, InputValueKey, useOptionContext } from "@/data";
import {
  CaretIcon,
  DragIcon,
  XIcon,
  useDragRefContext,
} from "@/components/common";
import {
  CheckboxInputWithLabel,
  InfoCard,
  InputWithLabel,
} from "@/components/common/styles";

export interface DateValueBoxProps {
  value: InputValue;
  updateValue: (key: InputValueKey, value: string | number | boolean) => void;
  deleteFunction: () => void;
}

export const DateValueBox = ({
  value,
  updateValue,
  deleteFunction,
}: DateValueBoxProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(value.Title === "New Value");
  const [trigger, setTrigger] = useState<boolean>(false);

  const dragRef = useDragRefContext();

  const { getOption } = useOptionContext();
  const inflation = getOption("Inflation");

  const updatePage = () => setTrigger(!trigger);

  // the inputs and checkboxes of the DateValueBox
  const inputs = [
    { label: "Title", type: "text", additionalFields: {} },
    { label: "Contribution / Month", type: "number", additionalFields: {} },
    {
      label: "Start Date",
      type: "month",
      additionalFields: { max: value["End Date"] },
    },
    {
      label: "End Date",
      type: "month",
      additionalFields: { min: value["Start Date"] },
    },
    { label: "Contribution IPY (%)", type: "number", additionalFields: {} },
    { label: "APY (%)", type: "number", additionalFields: {} },
    { label: "Current Value", type: "number", additionalFields: {} },
  ];

  const checkboxes = [
    [
      {
        label: "One-Time",
        onChange: (e: any) => {
          updateValue("End Date", value["Start Date"]);
          updatePage();
        },
        defaultValue: value["Start Date"] == value["End Date"],
      },
      {
        label: "No End Date",
        onChange: (e: any) => {
          updateValue("End Date", "2500-01");
          updatePage();
        },
        defaultValue: value["End Date"] == "2500-01",
      },
      {
        label: "CI = Inflation",
        onChange: (e: any) => {
          updateValue("Contribution IPY (%)", inflation);
          updatePage();
        },
        defaultValue: value["Contribution IPY (%)"] == inflation,
      },
    ],
  ];

  const renderInputs = () =>
    inputs.map(({ label, type, additionalFields }) => {
      const props = {
        label: label,
        inputProps: {
          type,
          value: (value as { [key: string]: any })[label],
          onChange: (e: any) => {
            updateValue(label as InputValueKey, e.target.value);
            updatePage();
          },
          ...additionalFields,
        },
      };
      return <InputWithLabel {...props} key={label} />;
    });

  const renderCheckBoxes = () =>
    checkboxes.map((block, i) => (
      <div className="flex flex-col justify-end" key={`chekboxes block ${i}`}>
        {block.map(({ label, onChange, defaultValue }) => {
          const props = {
            label: label,
            inputProps: {
              onChange,
              checked: defaultValue,
            },
          };
          return <CheckboxInputWithLabel {...props} key={label} />;
        })}
      </div>
    ));

  return (
    <InfoCard isGrid={isOpen}>
      {/* The titlebar of the box */}
      <CaretIcon {...{ isOpen, setIsOpen }} />
      {isOpen ? null : (
        <div
          className="w-full h-full flex align-center justify-center"
          ref={dragRef}
        >
          <p>{value.Title}</p>
        </div>
      )}
      <div className="flex justify-end">
        {isOpen ? (
          <div ref={dragRef} className="px-3">
            <DragIcon />
          </div>
        ) : null}
        <XIcon {...{ deleteFunction }} />
      </div>

      {isOpen
        ? [
            // all the inputs
            ...renderInputs(),
            ...renderCheckBoxes(),
          ]
        : null}
    </InfoCard>
  );
};
