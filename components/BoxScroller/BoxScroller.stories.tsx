import type { Meta } from "@storybook/react";

import {
  InputValue,
  InputValueProvider,
  useInputValueContext,
} from "../../data";
import { BoxScroller } from "./BoxScroller";
import { useEffect, useState } from "react";
// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Components/BoxScroller",
  component: BoxScroller,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} satisfies Meta<typeof BoxScroller>;

export default meta;

export const Default = () => {
  return (
    <InputValueProvider>
      <Child />
    </InputValueProvider>
  );
};

const Child = () => {
  const [isReady, setIsReady] = useState<boolean>(false);

  const { setInputValues } = useInputValueContext();
  const values: Array<InputValue> = [
    {
      Title: "Groceries",
      "Current Value": 3,
      "Start Date": "2023-06",
      "End Date": "2024-06",
      "APY (%)": 5,
      Type: "Investment",
    },
    {
      Title: "Groceries",
      "Current Value": 3,
      "Start Date": "2023-06",
      "End Date": "2024-06",
      "APY (%)": 5,
      Type: "Investment",
    },
    {
      Title: "Groceries",
      "Current Value": 3,
      "Start Date": "2023-06",
      "End Date": "2024-06",
      "APY (%)": 5,
      Type: "Expense",
    },
    {
      Title: "Groceries",
      "Current Value": 3,
      "Start Date": "2023-06",
      "End Date": "2024-06",
      "APY (%)": 5,
      Type: "Expense",
    },
    {
      Title: "Groceries",
      "Current Value": 3,
      "Start Date": "2023-06",
      "End Date": "2024-06",
      "APY (%)": 5,
      Type: "Expense",
    },
  ];

  useEffect(() => {
    if (!isReady) {
      setInputValues(values);
      setIsReady(true);
    }
  });

  return isReady ? <BoxScroller /> : null;
};
