import type { Meta } from "@storybook/react";
import {
  ResultingBalanceOptionInput,
  ResultingBalanceOptionInputProps,
} from "./ResultingBalanceOptionInput";
import { useState } from "react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Components/ResultingBalanceOptionInput",
  component: ResultingBalanceOptionInput,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} satisfies Meta<typeof ResultingBalanceOptionInput>;

export default meta;

export const Default = () => {
  return <ResultingBalanceOptionInput />;
};
