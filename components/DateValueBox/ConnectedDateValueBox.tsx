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

  const value = getInputValue(id);

  if (!id) return null;

  const updateValue = (key: InputValueKey, value: string | number) =>
    modifyInputValue(id, key, value);

  const deleteFunction = () => deleteInputValue(id);

  return (
    <DragObject itemID={id}>
      <DateValueBox {...{ value, updateValue, deleteFunction }} />
    </DragObject>
  );
};
