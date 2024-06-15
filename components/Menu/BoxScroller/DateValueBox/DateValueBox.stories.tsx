import type { Meta } from "@storybook/react";

import { InputValue, InputValueKey } from "@/data";
import { DateValueBox } from "./DateValueBox";
import { useState } from "react";
// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Components/DateValueBox",
  component: DateValueBox,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} satisfies Meta<typeof DateValueBox>;

export default meta;

export const Default = () => {
  const initial: InputValue = {
    Title: "Groceries",
    "Current Value": 300,
    "Contribution / Month": 5,
    "Start Date": "2023-06",
    "End Date": "2024-06",
    "Contribution IPY (%)": 5,
    "APY (%)": 5,
    Type: "beep",
  };

  const [data, setData] = useState<InputValue>(initial);

  const updateValue = (key: InputValueKey, value: string | number | boolean) =>
    setData({ ...data, [key]: value });

  return (
    <DateValueBox {...{ value: data, updateValue, deleteFunction: () => {} }} />
  );
};
