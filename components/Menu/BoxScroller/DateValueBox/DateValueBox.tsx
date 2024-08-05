"use client";

import React, { useRef, useState } from "react";
import {
  InputValue,
  InputValueKey,
  InputValueType,
  useOptionContext,
} from "@/data";
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
  updateValue: (key: InputValueKey, value: InputValueType) => void;
  deleteFunction: () => void;
  fullInputs: boolean;
}

export const DateValueBox = ({
  value,
  updateValue,
  deleteFunction,
  fullInputs,
}: DateValueBoxProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(value.Title === "New Value");

  const dragRef = useDragRefContext();

  const { getOption } = useOptionContext();
  const inflation = getOption("Inflation");

  const isInvestment = value["APY (%)"] !== 0;

  // the inputs and checkboxes of the DateValueBox
  const inputs = getAvailableInputs(fullInputs, value);

  const inputRefs: {
    [key: string]: React.MutableRefObject<HTMLInputElement | null>;
  } = {};
  inputs.forEach((inp) => {
    inputRefs[inp.label] = useRef(null);
  });
  const valueRerender = (key: InputValueKey, newValue: InputValueType) => {
    if (inputRefs[key].current === null) return;
    inputRefs[key].current.value = String(newValue);
  };

  const checkboxes =
    fullInputs || !isInvestment
      ? [
          [
            {
              label: "One-Time",
              onChange: (e: any) => {
                valueRerender("End Date", value["Start Date"]);
                updateValue("End Date", value["Start Date"]);
              },
              defaultValue: value["Start Date"] == value["End Date"],
            },
            {
              label: "No End Date",
              onChange: (e: any) => {
                valueRerender("End Date", "2500-01");
                updateValue("End Date", "2500-01");
              },
              defaultValue: value["End Date"] == "2500-01",
            },
            {
              label: "CI = Inflation",
              onChange: (e: any) => {
                valueRerender("Contribution IPY (%)", inflation);
                updateValue("Contribution IPY (%)", inflation);
              },
              defaultValue: value["Contribution IPY (%)"] == inflation,
            },
          ],
        ]
      : [];

  const renderInputs = () =>
    inputs.map(({ label, type, additionalFields }) => {
      const props = {
        label: label,
        inputProps: {
          type,
          defaultValue: (value as { [key: string]: any })[label],
          onChange: (e: any) => {
            if (
              !fullInputs &&
              isInvalid(value, label as InputValueKey, e.target.value)
            ) {
              e.currentTarget.style.color = "red";
              e.currentTarget.style.border = "1px solid red";
              return;
            }

            e.currentTarget.style.color = "";
            e.currentTarget.style.border = "";

            updateValue(label as InputValueKey, e.target.value);
          },
          ref: inputRefs[label],
          ...additionalFields,
        },
      };
      return <InputWithLabel {...props} key={label} />;
    });

  const renderCheckBoxes = () =>
    checkboxes.map((block, i) => (
      <div className="flex flex-col justify-end" key={`checkboxes block ${i}`}>
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
        {isOpen && fullInputs ? (
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

const getAvailableInputs = (fullInputs: boolean, value: InputValue) => {
  type keys =
    | "Title"
    | "Contribution / Month"
    | "Start Date"
    | "End Date"
    | "Contribution IPY (%)"
    | "APY (%)"
    | "Current Value";

  const allInputs = {
    Title: { label: "Title", type: "text", additionalFields: {} },
    "Contribution / Month": {
      label: "Contribution / Month",
      type: "number",
      additionalFields: {},
    },
    "Start Date": {
      label: "Start Date",
      type: "month",
      additionalFields: { max: value["End Date"] },
    },
    "End Date": {
      label: "End Date",
      type: "month",
      additionalFields: { min: value["Start Date"] },
    },
    "Contribution IPY (%)": {
      label: "Contribution IPY (%)",
      type: "number",
      additionalFields: {},
    },
    "APY (%)": { label: "APY (%)", type: "number", additionalFields: {} },
    "Current Value": {
      label: "Current Value",
      type: "number",
      additionalFields: {},
    },
  };

  if (fullInputs) return Object.values(allInputs);

  const contributionLimit =
    value["Contribution / Month"] >= 0 ? { min: 0 } : { max: -0.01 };
  allInputs["Contribution / Month"].additionalFields = contributionLimit;

  const isInvestment = value["APY (%)"] != 0;

  const chosenInputs: Array<keys> = isInvestment
    ? ["Title", "Start Date", "APY (%)", "Current Value"]
    : [
        "Title",
        "Contribution / Month",
        "Start Date",
        "End Date",
        "Contribution IPY (%)",
      ];

  return chosenInputs.map((title: keys) => allInputs[title]);
};

const isInvalid = (
  prevValue: InputValue,
  label: InputValueKey,
  newValue: string
) => {
  // if is investment and APY is 0
  if (prevValue["APY (%)"] !== 0) {
    if (label === "APY (%)" && Number(newValue) === 0) return true;
    return false;
  }

  // if is income or expense
  if (label === "Contribution / Month") {
    const value = Number(newValue);
    if (prevValue["Contribution / Month"] >= 0 && value < 0) return true;
    if (prevValue["Contribution / Month"] < 0 && value >= 0) return true;
  }

  return false;
};
