import type { Meta } from "@storybook/react";
import { SingleOptionInput, SingleOptionInputProps } from "./SingleOptionInput";
import { useState } from "react";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Components/SingleOptionInput",
  component: SingleOptionInput,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} satisfies Meta<typeof SingleOptionInput>;

export default meta;

export const Default = () => {
  const [value, updateValue] = useState("2023-06");
  const props: SingleOptionInputProps = {
    label: "First Month",
    value,
    updateValue: updateValue as () => void,
  };
  return <SingleOptionInput {...props} />;
};
