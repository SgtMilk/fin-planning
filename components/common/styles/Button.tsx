import React from "react";

export const Button = ({
  buttonName,
  handleFunc,
  color = "cyan-700",
  hoverColor = "cyan-900",
}: {
  buttonName: string;
  handleFunc: () => void;
  color?: string;
  hoverColor?: string;
}) => {
  return (
    <button
      className={`bg-${color} hover:bg-${hoverColor} text-white font-bold py-2 px-4 rounded whitespace-nowrap`}
      onClick={handleFunc}
    >
      {buttonName}
    </button>
  );
};
