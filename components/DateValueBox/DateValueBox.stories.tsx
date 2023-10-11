import type { Meta, StoryObj } from "@storybook/react";

import {
  DateValueBox,
  DateValueBoxProps,
  DateValueInputs,
} from "./DateValueBox";
import { useRef } from "react";
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
type Story = StoryObj<typeof meta>;

export const Default = () => {
  const value = useRef<DateValueInputs>({
    Title: "Groceries",
    "Current Value": 3,
    "Start Date": "2023-06",
    "End Date": "2024-06",
  });
  return <DateValueBox {...{ value, deleteFunction: () => {} }} />;
};
