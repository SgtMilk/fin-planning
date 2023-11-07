"use client";

import React, { useState } from "react";
import { InputValue, InputValueKey, useOptionContext } from "../../data";
import { CaretIcon, XIcon } from "../Base";

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
      {
        label: "Taxed CG",
        onChange: (e: any) => {
          updateValue("Taxed CG", !value["Taxed CG"]);
          updatePage();
        },
        defaultValue: value["Taxed CG"],
      },
    ],
  ];

  const renderInputs = () =>
    inputs.map(({ label, type, additionalFields }) => (
      <div key={label}>
        <label
          htmlFor={label}
          className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
        >
          {label}
        </label>
        <input
          id={label}
          className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type={type}
          value={(value as { [key: string]: any })[label]}
          onChange={(e: any) => {
            updateValue(label as InputValueKey, e.target.value);
            updatePage();
          }}
          {...additionalFields}
        />
      </div>
    ));

  const renderCheckBoxes = () =>
    checkboxes.map((block, i) => (
      <div
        className="flex flex-col justify-center"
        key={`chekboxes block ${i}`}
      >
        {block.map(({ label, onChange, defaultValue }) => (
          <div className="flex flex-row" key={label}>
            <div className="flex items-center">
              <input
                id={label}
                className="w-4 h-4"
                type="checkbox"
                onChange={onChange}
                checked={defaultValue}
              />
              <label
                htmlFor={label}
                className="block text-sm font-medium text-slate-900 dark:text-white pl-3"
              >
                {label}
              </label>
            </div>
          </div>
        ))}
      </div>
    ));

  return (
    <div
      className={`${
        isOpen ? "grid grid-cols-2" : "flex flex-row justify-between"
      } gap-6 p-6 bg-white border border-slate-200 rounded-lg shadow dark:bg-slate-800 dark:border-slate-700 w-96`}
    >
      {/* The titlebar of the box */}
      <CaretIcon {...{ isOpen, setIsOpen }} />
      {isOpen ? null : <p>{value.Title}</p>}
      <div className="flex justify-end">
        <XIcon {...{ deleteFunction }} />
      </div>

      {isOpen
        ? [
            // all the inputs
            ...renderInputs(),
            ...renderCheckBoxes(),
          ]
        : null}
    </div>
  );
};
