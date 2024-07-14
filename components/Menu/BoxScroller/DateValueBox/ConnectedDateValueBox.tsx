import { InputValueKey, useInputValueContext } from "@/data";
import React from "react";
import { DateValueBox } from "./DateValueBox";
import { DragObject } from "@/components/common";

export interface ConnectedDateValueBoxProps {
  id: string;
  fullInputs: boolean;
}

export const ConnectedDateValueBox = ({
  id,
  fullInputs,
}: ConnectedDateValueBoxProps) => {
  const { getInputValue, modifyInputValue, deleteInputValue } =
    useInputValueContext();

  const oldValue = getInputValue(id);

  if (!id) return null;

  const updateValue = (key: InputValueKey, value: string | number | boolean) =>
    modifyInputValue(id, key, value);
  const deleteFunction = () => deleteInputValue(id);

  if (fullInputs)
    return (
      <DragObject itemID={id}>
        <DateValueBox
          {...{ value: oldValue, updateValue, deleteFunction, fullInputs }}
        />
      </DragObject>
    );

  return (
    <DateValueBox
      {...{ value: oldValue, updateValue, deleteFunction, fullInputs }}
    />
  );
};
