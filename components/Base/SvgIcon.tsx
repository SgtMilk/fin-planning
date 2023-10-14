import React from "react";

export interface SvgIconProps {
  handleFunction: () => void;
  component: Array<React.ReactElement>;
}

export const SvgIcon = ({ handleFunction, component }: SvgIconProps) => (
  <button onClick={handleFunction}>
    <svg
      className="w-5 h-5 dark:text-white stroke-slate-900"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {component}
    </svg>
  </button>
);
