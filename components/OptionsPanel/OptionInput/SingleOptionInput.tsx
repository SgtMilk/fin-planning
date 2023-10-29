"use client";

import { OptionKey, getInputType, useOptionContext } from "@/data";
import React, { useState } from "react";

export interface SingleOptionInputProps {
  label: OptionKey;
  value: string | number;
  updateValue: (value: string | number | boolean) => void;
  additionalFields?: { [key: string]: any };
}

export interface ConnectedSingleOptionInputProps {
  label: OptionKey;
}

export const ConnectedSingleOptionInput = ({
  label,
}: ConnectedSingleOptionInputProps) => {
  const { getOption, modifyOption } = useOptionContext();
  const props: SingleOptionInputProps = {
    label,
    value: getOption(label),
    updateValue: (value) => modifyOption(label, value),
  };

  return <SingleOptionInput {...props} />;
};

export const SingleOptionInput = ({
  label,
  value,
  updateValue,
  additionalFields = {},
}: SingleOptionInputProps) => {
  const [trigger, setTrigger] = useState<boolean>(false);
  const updatePage = () => setTrigger(!trigger);

  let type = getInputType(label);

  return (
    <div
      className={`m-1 p-6 bg-white border border-slate-200 rounded-lg shadow dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 w-96`}
    >
      <div key={label}>
        <label
          htmlFor={label}
          className="block mb-2 text-sm font-medium text-slate-900 dark:text-white"
        >
          {label}
        </label>
        <input
          id={label}
          className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 hover:bg-slate-100"
          type={type}
          value={value}
          onChange={(e: any) => {
            updateValue(e.target.value);
            updatePage();
          }}
          {...additionalFields}
        />
      </div>
    </div>
  );
};
