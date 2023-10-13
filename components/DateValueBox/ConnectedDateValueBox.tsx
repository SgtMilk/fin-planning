import { InputValueKey, useInputValueContext } from "../../data";
import React, { useMemo } from "react";
import { DateValueBox } from "./DateValueBox";

export interface ConnectedDateValueBoxProps {
  id: string;
}
const ConnectedDateValueBox = ({ id }: ConnectedDateValueBoxProps) => {
  const { getInputValue, modifyInputValue, deleteInputValue, state } =
    useInputValueContext();

  const value = useMemo(() => getInputValue(id), [state[id]]);

  if (!id) return null;

  const updateValue = (key: InputValueKey, value: string | number) => {
    modifyInputValue(id, key, value);
  };
  const deleteFunction = () => {
    deleteInputValue(id);
  };
  return <DateValueBox {...{ value, updateValue, deleteFunction }} />;
};

export default ConnectedDateValueBox;
