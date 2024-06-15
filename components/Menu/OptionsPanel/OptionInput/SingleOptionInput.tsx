"use client";

import { InfoCard, InputWithLabel } from "@/components/common/styles";
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

  const inputProps = {
    label,
    inputProps: {
      type,
      value,
      onChange: (e: any) => {
        updateValue(e.target.value);
        updatePage();
      },
      ...additionalFields,
    },
  };

  return (
    <InfoCard isGrid={false}>
      <InputWithLabel {...inputProps} />
    </InfoCard>
  );
};
