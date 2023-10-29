import { InputValueKey, useInputValueContext } from "../../data";
import React from "react";
import { DateValueBox } from "./DateValueBox";
import { DragObject } from "../Base";

export interface ConnectedDateValueBoxProps {
  id: string;
}

export const ConnectedDateValueBox = ({ id }: ConnectedDateValueBoxProps) => {
  const { getInputValue, modifyInputValue, deleteInputValue } =
    useInputValueContext();

  const oldValue = getInputValue(id);

  if (!id) return null;

  const updateValue = (
    key: InputValueKey,
    value: string | number | boolean
  ) => {
    const startDateFault =
      key === "Start Date" &&
      (value as string).localeCompare(oldValue["End Date"]) > 0;
    const endDateFault =
      key === "End Date" &&
      (value as string).localeCompare(oldValue["Start Date"]) < 0;

    if (startDateFault || endDateFault) return;
    modifyInputValue(id, key, value);
  };

  const deleteFunction = () => deleteInputValue(id);

  return (
    <DragObject itemID={id}>
      <DateValueBox {...{ value: oldValue, updateValue, deleteFunction }} />
    </DragObject>
  );
};
